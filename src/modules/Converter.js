const path = require('path');
const log = require('electron-log');

const ffmpeg = require('fluent-ffmpeg');

const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');

ffmpeg.setFfmpegPath(ffmpegStatic.path.replace('app.asar', 'app.asar.unpacked'));
ffmpeg.setFfprobePath(ffprobeStatic.path.replace('app.asar', 'app.asar.unpacked'));

const { EXPORTS } = require('../modules/Constants.js');

class Converter {
  constructor() {
      this.defaults = {
          start: 0,
          duration: 1,
          scaledDown: 2,
          scaledFps: 1,
          sampleColors: true,
          exportType: EXPORTS.GIF
      };

      this.extensions = {
          gif: 'gif',
          video: 'mp4'
      };
  }

  _gatherData(data) {
    let stream = data.streams[0];

    let start = parseInt(data.format.start_time);

    if (isNaN(start)) {
      start = 0;
    }

    this.metadata = {
      fps: this._parseFramerate(stream['r_frame_rate']),
      width: stream.width,
      height: stream.height,
      start,
      duration: data.format.duration * 1000
    };

    return this.metadata;
  }

  _parseFramerate(fpsStr) {
      const parts = fpsStr.split('/').map(v => parseInt(v, 10));

      return parts[0] / parts[1];
  }

  probeInfo(input) {
    log.info("Probe info", input);
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(input)
        .ffprobe((err, data) => {
          if (err) {
            log.error("Probe info error", err);
            reject(err);
          } else {
            log.info("Probe info success", data);
            resolve(data);
          }
        });
    });
  }

  saveFile(onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      const { input, output } = this.info;
      const { width, height, fps } = this.metadata;
      const { start, duration, scaledFps, scaledDown, sampleColors, exportType } = this.options;

      const outputPath = this._getOutputName(output, exportType);

      this.command = ffmpeg()
        .input(input)
        .setStartTime(start)
        .duration(duration);

      this.command.complexFilter(this._getComplexFilter(fps, scaledFps, width, height, scaledDown, sampleColors, exportType), 'output')
        .on('start', () => log.info('Save file start', { options: this.options, metadata: this.metadata, info: this.info }))
        .on('progress', progress => this.reportProgress(progress, onProgress))
        .on('end', () => resolve(outputPath))
        .on('error', err => {
          log.error("Save file error", err);
          reject(err);
        })
        .save(outputPath);
    });
  }

  _getOutputName(output, exportType) {
      const ext = path.extname(output);
      const extLess = output.slice(0, (ext.length) * -1);

      return [
          extLess,
          this.extensions[exportType.toLowerCase()]
      ].join('.');
  }

  _getComplexFilter(fps, scaledFps, width, height, scaledDown, sampleColors = true, exportType) {
    const filter = [];
    let idx = 0;

    const fpsFilter = {
        inputs: '0:v',
        filter: 'fps',
        options: this._getFps(fps, scaledFps),
        outputs: '0'
    };

    const scaleFilter = {
        inputs: '0',
        filter: 'scale',
        options: `${this._getSize(width, height, scaledDown)}:flags=lanczos`,
        outputs: exportType === EXPORTS.GIF ? '1' : 'output'
    };

    if (scaledDown != 1) {
      filter.push(scaleFilter);
      idx++;
    } else {
      fpsFilter.outputs = '1';
    }

    if (scaledFps != 1) {
      idx++;
      filter.unshift(fpsFilter);
    }

    if (exportType === EXPORTS.GIF) {
      const splitFilter = { inputs: idx > 0 ? '1' : '0', filter: 'split', outputs: ['a', 'b'] };
      const palettegenFilter = { inputs: 'a', filter: 'palettegen', outputs: 'p' };
      const paletteuseFilter = { inputs: ['b', 'p'], filter: 'paletteuse', outputs: 'output' };

      if (sampleColors) {
          palettegenFilter.options = 'stats_mode=single';
          paletteuseFilter.options = 'new=1';
      }

      filter.push(splitFilter);
      filter.push(palettegenFilter);
      filter.push(paletteuseFilter);
    }

    return filter;
  }

  _getFps(fps, scaledFps) {
      return fps / scaledFps;
  }

  _getSize(width, height, scaledDown) {
      return `${width / scaledDown}:${height / scaledDown}`;
  }

  reportProgress(properties, onProgress) {
    const currentDelta = this._convertTimeToSeconds(properties.timemark) / this.options.duration;

    onProgress(currentDelta);
  }


  _convertTimeToSeconds(time) {
      return time.split(':').map((v, index) => {
          let _v = parseFloat(v);

          switch(index) {
              case 0:
                  return _v * 60 * 60;
              case 1:
                  return _v * 60;
              case 2:
                  return _v;
          }
      }).reduce((prev, curr) => prev + curr, 0);
  }

  convert({ file: input, destination: output, properties }, onProgress) {
    this.info = { input, output };

    this.metadata = {};

    this.options = Object.assign({}, this.defaults, properties);

    this.options.start = this.options.start / 1000;
    this.options.duration = this.options.duration / 1000;

    return this.probeInfo(this.info.input)
      .then(data => this._gatherData(data))
      .then(gifData => this.saveFile(onProgress))
      .then(path => {
        this.command = null;
        return path;
      })
      .catch(err => {
        console.log(err);
      });
  }

  kill() {
    if (this.command) {
      this.command.kill();
    }
  }

  getInfo(input) {
    return this.probeInfo(input)
      .then(data => this._gatherData(data));
  }

  static thumbnail(input) {
    ffmpeg(input)
      .screenshots({
        timestamps: [0],
        filename: 'thumb.png',
        size: '320x240'
      });
  }
}

module.exports = Converter;
