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
    if (oldProps.time !== this.props.time) {
      this.video.currentTime = this.props.time;
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

  render() {
    const { className, file } = this.props;

    const cls = classNames(
      className,
      'videopreview',
      {
        'videopreview--show': file
      }
    );

    return <video ref={this.setRef} className={cls} src={this.displayFile(file)}/>;
  }
}

export default VideoPreview;
