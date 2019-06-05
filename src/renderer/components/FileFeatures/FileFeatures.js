import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./FileFeatures.scss";

class FileFeatures extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  getSizeNumbers(width, height, scale) {
    return [
      Math.floor(width / scale),
      Math.floor(height / scale),
    ];
  }

  getSize(width, height, scale) {
    const nums = this.getSizeNumbers(width, height, scale);

    return `${nums[0]}x${nums[1]}`;
  }

  getFps(fps, scale) {
    return `${fps / scale}FPS`;
  }

  estimateFileSize(videoInfo, properties) {
    let total = 0;

    if (!properties.sampleColors) {
      total += 3;
    }

    const nums = this.getSizeNumbers(videoInfo.width, videoInfo.height, properties.scaledDown);
    let pixels = nums[0] * nums[1];

    if (pixels >= 2000000) {
      total += 2;
    } else if (pixels >= 1000000) {
      total += 1;
    }

    if (properties.scaledFps == 1) {
      total += 1;
    }

    return `${total}min +`;
  }

  render() {
    const { className, videoInfo, properties } = this.props;

    const cls = classNames(
      className,
      'filefeatures'
    );

    return (
      <div className={cls}>
        <span>{ this.getSize(videoInfo.width, videoInfo.height, properties.scaledDown) }</span>
        <span>{ this.getFps(videoInfo.fps, properties.scaledFps) }</span>
        <span>Estimated save: { this.estimateFileSize(videoInfo, properties) }</span>
      </div>
    );
  }
}

export default FileFeatures;
