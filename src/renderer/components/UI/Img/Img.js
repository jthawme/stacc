import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';
import { InView } from 'react-intersection-observer';

// Redux

// Components

// CSS, Requires
import ImageLoader from './ImageLoader';
import "./Img.scss";

class Img extends React.Component {
  static propTypes = {
    className: PropTypes.string,

    small: PropTypes.string,
    src: PropTypes.string,

    bufferTimeout: PropTypes.number,
  };

  static defaultProps = {
    bufferTimeout: 150,
    threshold: 0.5,
    root: 'main'
  };

  state = {
    loaded: false,
    display: false
  };

  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src && this.state.loaded) {
      this.setState({
        loaded: false,
        display: false
      });

      this.loadImage(this.props.src);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  loadImage(src) {
    ImageLoader(src)
      .then(() => {
        this.setState({
          loaded: src
        });

        this.timer = setTimeout(() => {
          this.setState({
            display: true
          });
        }, this.props.bufferTimeout);
      });
  }

  getRoot() {
    if (typeof this.props.root === 'string') {
      return document.querySelector(this.props.root)
    } else {
      return this.props.root;
    }
  }

  onViewChange = (inView) => {
    if (inView && !this.state.loaded) {
      this.loadImage(this.props.full);
    }
  }

  render() {
    const { className, small, threshold } = this.props;
    const { loaded, display } = this.state;

    const cls = classNames(
      className,
      'img',
      {
        ['img__loaded']: display
      }
    );

    return (
      <InView
        root={this.getRoot()}
        tag="div"
        className={cls}
        onChange={this.onViewChange}
        threshold={threshold}>
        <img className={'img__small'} src={small ? small : ''}/>
        <img className={'img__full'} src={loaded ? loaded : ''}/>
      </InView>
    );
  }
}

export default Img;
