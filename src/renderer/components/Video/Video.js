import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Video.scss";

class Video extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    url: PropTypes.string
  };

  render() {
    const { className, url } = this.props;

    const cls = classNames(
      className,
      'video'
    );

    return (
      <div className={cls}>
        <video src={ url }/>
      </div>
    );
  }
}

export default Video;
