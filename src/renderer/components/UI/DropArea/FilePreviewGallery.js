import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import styles from "./FilePreviewGallery.module.scss";

class FilePreviewGallery extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className, children } = this.props;

    const cls = classNames(
      className,
      'filepreviewgallery'
    );

    return (
      <div className={cls}>
        { children }
      </div>
    );
  }
}

export default FilePreviewGallery;
