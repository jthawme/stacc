import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';
import { SlideDown } from 'react-slidedown';

// Redux

// Components

// CSS, Requires
import { SPEEDS, ANIMATION } from '../Common/constants';
import 'react-slidedown/lib/slidedown.css'
import styles from "./Slider.module.scss";

class Slider extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    closed: PropTypes.bool,
    speed: PropTypes.string,
    animation: PropTypes.string,

    onClosed: PropTypes.func,
    onOpened: PropTypes.func,
  };

  static defaultProps = {
    speed: SPEEDS.NORMAL,
    animation: ANIMATION.NORMAL,

    onClosed: () => {},
    onOpened: () => {},
  };

  onRef = ref => {
    if (ref) {
      this.ref = ref;
      ref.addEventListener('transitionend', this.onTransitionEnd);
    } else {
      this.ref.removeEventListener('transitionend', this.onTransitionEnd);
    }
  }

  onTransitionEnd = () => {
    if (this.props.closed) {
      this.props.onClosed();
    } else {
      this.props.onOpened();
    }
  }

  render() {
    const { className, children, closed, speed, animation } = this.props;

    const cls = classNames(
      className,
      styles.slider,
      styles[speed],
      styles[`animation-${animation}`]
    );

    return (
      <SlideDown ref={this.onRef} closed={closed} className={cls}>
        { children }
      </SlideDown>
    );
  }
}

export default Slider;
