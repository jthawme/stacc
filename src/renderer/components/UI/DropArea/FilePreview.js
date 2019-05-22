import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Icon from '../Icon/Icon';

// CSS, Requires
import "./FilePreview.scss";

class FilePreview extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    nameLength: PropTypes.number
  };

  static defaultProps = {
    nameLength: 12
  }

  state = {
    preview: false
  };

  componentDidMount() {
    if (this.isImage(this.props.file.type)) {
      this.loadImage(this.props.file);
    }
  }

  loadImage(file) {
    const reader = new FileReader();
    reader.onload = e => {
      this.setState({ preview: e.target.result });
    };
    reader.readAsDataURL(file);
  }

  isImage(type) {
    return type.indexOf('image/') >= 0;
  }

  renderType(type, name) {
    if (this.isImage(type)) {
      if (this.state.preview) {
        return (
          <div className={'filepreview__content'} style={{
            backgroundImage: `url(${ this.state.preview })`
          }} />
        );
      } else {
        return (
          <div className={'filepreview__content'}>
            <Icon icon="image"/>
          </div>
        );
      }
    } else {
      return (
        <div className={'filepreview__content'}>
          <Icon icon="document"/>
          <span className={'filepreview__title'}>{ this.clipName(name) }</span>
        </div>
      )
    }
  }

  clipName(name) {
    return name.length > this.props.nameLength ? `${name.substring(0, this.props.nameLength - 3)}...` : name;
  }

  render() {
    const { className, file } = this.props;

    const cls = classNames(
      className,
      'filepreview'
    );

    return (
      <div className={cls}>
        { this.renderType(file.type, file.name) }
      </div>
    );
  }
}

export default FilePreview;
