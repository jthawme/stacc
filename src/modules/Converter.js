const path = require('path');

const ffmpeg = require('fluent-ffmpeg');

const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');

ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

class Converter {
    constructor() {
        this.defaults = {
            start: 0,
            duration: 1,
            scaledDown: 1,
            scaledFps: 1,
            sampleColors: true,
            asGif: true
        };

        this.extensions = {
            gif: 'gif',
            video: 'mp4'
        };
    }

    _gatherData(data) {
        let stream = data.streams[0];

        this.metadata = {
            fps: this._parseFramerate(stream['r_frame_rate']),
            width: stream.width,
            height: stream.height
        };

        return this.metadata;
    }

    _parseFramerate(fpsStr) {
        const parts = fpsStr.split('/').map(v => parseInt(v, 10));

        return parts[0] / parts[1];
    }

    getInfo(input) {
        return new Promise((resolve, reject) => {
            ffmpeg()
                .input(input)
                .ffprobe((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
        });
    }

    saveFile(onProgress = () => {}) {
      return new Promise((resolve, reject) => {
        const { input, output } = this.info;
        const { width, height, fps } = this.metadata;
        const { start, duration, scaledFps, scaledDown, sampleColors, asGif } = this.options;

        const outputPath = this._getOutputName(output, asGif);

        this.command = ffmpeg()
          .input(input)
          .setStartTime(start)
          .duration(duration)
          .complexFilter(this._getComplexFilter(fps, scaledFps, width, height, scaledDown, sampleColors, asGif), 'output');

        this.command.on('progress', progress => this.reportProgress(progress, onProgress))
          .on('error', reject)
          .on('end', () => resolve(outputPath))
          .save(outputPath);
      });
    }

    _getOutputName(output, asGif) {
        const ext = path.extname(output);
        const extLess = output.slice(0, (ext.length) * -1);

        return [
            extLess,
            asGif ? this.extensions.gif : this.extensions.video
        ].join('.');
    }

    _getComplexFilter(fps, scaledFps, width, height, scaledDown, sampleColors = true, asGif = true) {
        const fpsFilter = {
            inputs: '0:v',
            filter: 'fps',
            options: this._getFps(fps, scaledFps),
            outputs: '0'
        };
        const scaleFilter = {
            inputs: '0',
            filter: 'scale',
            options: this._getSize(width, height, scaledDown),
            outputs: asGif ? '1' : 'output'
        };
        const splitFilter = { inputs: '1', filter: 'split', outputs: ['a', 'b'] };
        const palettegenFilter = { inputs: 'a', filter: 'palettegen', outputs: 'p' };
        const paletteuseFilter = { inputs: ['b', 'p'], filter: 'paletteuse', outputs: 'output' };

        const filter = [
            fpsFilter,
            scaleFilter
        ];

        if (asGif) {
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

    reportProgress({ timemark }, onProgress) {
        const currentDelta = this._convertTimeToSeconds(timemark) / this.options.duration;

        onProgress(currentDelta);
    }


    _convertTimeToSeconds(time) {
        return time.split(':').map((v, index) => {
            let _v = parseInt(v, 10);

            switch(index) {
                case 0:
                    return _v * 60 * 60;
                case 1:
                    return _v * 60;
                case 2:
                    return _v;
                case 3:
                    return _v / 100;
            }
        }).reduce((prev, curr) => prev + curr, 0);
    }

    convert({ input, output, options }, onProgress, onError, onFinish) {
      this.info = { input, output };

      this.metadata = {};

      this.options = Object.assign({}, this.defaults, options);

      this.getInfo(this.info.input)
        .then(data => this._gatherData(data))
        .then(gifData => this.saveFile(onProgress))
        .then(path => {
          this.command = null;
          onFinish(path)
        })
        .catch(onError);
    }

    kill() {
      if (this.command) {
        this.command.kill();
      }
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
