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

  render() {
    const { className } = this.props;

    const cls = classNames(
      className,
      'videopreview'
    );

    return (
      <div className={cls}>
        VideoPreview
      </div>
    );
  }
}

export default VideoPreview;
