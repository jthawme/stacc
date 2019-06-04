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

  getSize(width, height, scale) {
    return `${Math.floor(width / scale)}x${Math.floor(height / scale)}`;
  }

  getFps(fps, scale) {
    return `${fps / scale}FPS`;
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
        {/* <span>Estimate save time: { this.estimateFileSize() }</span> */}
      </div>
    );
  }
}

export default FileFeatures;
