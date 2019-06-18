import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./VideoPreview.scss";

class VideoPreview extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    time: 0
  };

  componentDidUpdate(oldProps) {
    if ((oldProps.time !== this.props.time || oldProps.file !== this.props.file) && this.video) {
      this.video.currentTime = this.props.time / 1000;
    }
  }

  displayFile(file) {
    if (!file) {
      return '';
    }

    return file.path.substring(0, 5) !== 'file:' ? `file:${file.path}` : file.path;
  }

  setRef = ref => {
    this.video = ref;

    if (ref) {
      ref.currentTime = this.props.time;
    }
  }

  isValidPreviewable(file) {
    if (!file) {
      return false;
    }

    const extname = file.path.split('.').pop();
    const valid = ['mp4', 'mov', 'webm'];

    return valid.includes(extname);
  }

  render() {
    const { className, file } = this.props;

    const cls = classNames(
      className,
      'videopreview',
      {
        'videopreview--show': file
      },
      {
        'videopreview--no-preview': !this.isValidPreviewable(file)
      }
    );

    return (
      <div className={cls}>
        <div className={`videopreview__no-preview`}>
          <h3>Oh no!</h3>
          <p>No preview available for this file type</p>
        </div>
        <video ref={this.setRef} className="videopreview__video" src={this.displayFile(file)}/>
      </div>
    );

  }
}

export default VideoPreview;
