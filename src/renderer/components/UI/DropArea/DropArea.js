import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Icon from '../Icon/Icon';

// CSS, Requires
import styles from "./DropArea.module.scss";

class DropArea extends React.Component {
  static propTypes = {
    className: PropTypes.string,

    multiple: PropTypes.bool,
    maxFiles: PropTypes.number,
    accept: PropTypes.array,

    command: PropTypes.string,
  };

  static defaultProps = {
    accept: ['*'],
    command: 'Drop files',
    multiple: false,
    maxFiles: 5
  };

  state = {
    dropping: false,
    files: []
  };

  onDragEnter = e => {
    e.preventDefault();
    this.startDrop();
  }

  onDragOver = e => {
    e.preventDefault();
    this.startDrop();
  };

  onDragEnd = e => {
    e.preventDefault();
    this.endDrop();
  };

  onDragLeave = e => {
    e.preventDefault();
    this.endDrop();
  };

  startDrop() {
    this.setState({
      dropping: true
    });
  }

  endDrop() {
    this.setState({
      dropping: false
    });
  }

  onDrop = e => {
    e.preventDefault();
    this.endDrop();

    if (e.dataTransfer.files) {
      this.handleFiles(e.dataTransfer.files);
    }
  };

  handleFiles(files) {
    if (!this.props.multiple) {
      files = [files[0]];
    } else {
      let _files = [];

      for (let i = 0; i < this.props.maxFiles; i++) {
        if (files[i]) {
          _files.push(files[i]);
        }
      }

      files = _files;
    }

    files = this.filteredFiles(files, this.props.accept);

    if (files.length === 0) {
      this.props.onInvalid();
    } else {
      let newFiles = this.state.files.concat(files);
      this.setState({ files: newFiles });

      if (this.props.onFiles) {
        this.props.onFiles(files);
      }
    }
  }

  filteredFiles(files, accept) {
    if (accept.find(a => a === '*')) {
      return files;
    }

    return files.filter(f => {
      let valid = false;
      accept.forEach(a => {
        if (!valid) {
          if (a.substring(0, 1) === '.') {
            if (f.name.substring((a.length) * -1) === a) {
              valid = true;
            }
          } else {
            let _a = a.replace('*', '');

            if (f.type.indexOf(_a) >= 0) {
              valid = true;
            }
          }
        }
      });

      return valid;
    });
  }

  onInputChange = e => {
    if (e.target.files.length) {
      this.handleFiles(e.target.files);
    }
  }

  renderChildren(children) {
    if (children) {
      return children(this.state.files, this.state.dropping);
    } else {
      return (
        <div className={styles.content}>
          <div className={styles.outline}/>
          <div className={styles.inner}>
            <Icon icon="download"/>
            <span>{ this.props.command }</span>
          </div>
        </div>
      );
    }
  }

  render() {
    const { className, multiple, accept, children } = this.props;
    const { dropping } = this.state;

    const cls = classNames(
      className,
      styles.droparea,
      {
        [styles.dropping]: dropping
      }
    );

    return (
      <label
        className={ cls }
        onDragOver={ this.onDragOver }
        onDragEnter={ this.onDragEnter }
        onDragLeave={ this.onDragLeave }
        onDragEnd={ this.onDragEnd }
        onDrop={ this.onDrop }>
        <input
          className={styles.hiddenInput}
          onChange={this.onInputChange}
          type="file"
          multiple={multiple}
          accept={accept}/>
        
        { this.renderChildren(children) }
      </label>
    );
  }
}

export default DropArea;
