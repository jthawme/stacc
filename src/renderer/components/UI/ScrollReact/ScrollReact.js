import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires

export const SCROLL_DIRS = {
  UP: 0,
  DOWN: 1
};

class ScrollReact extends React.Component {
  static propTypes = {
    root: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string
    ]),
    topThreshold: PropTypes.number,
    deltaThreshold: PropTypes.number,
  };

  static defaultProps = {
    root: 'body',
    topThreshold: 100,
    deltaThreshold: 50
  };

  constructor(props) {
    super(props);

    this.lastY = 0;
    this.commitY = 0;
    this.ticking = false;
    this.delta = false;

    this.state = {
      pinned: false,
      show: false
    };
  }

  componentDidMount() {
    this.addEventListeners();
  }

  addEventListeners() {
    const el = typeof this.props.root === 'string' ? document.querySelector(this.props.root) : this.props.root;

    el.addEventListener('scroll', e => {
      this.lastY = el.scrollTop;
      this.requestTick();
    });
  }

  requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(this.update);
      this.ticking = true;
    }
  }

  update = () => {
    const state = {};
    let delta = this.lastY - this.commitY;
    
    if (delta < 0 && this.delta > 0 || delta < 0 && this.delta === false) {
      state.direction = SCROLL_DIRS.UP;
    } else if (delta > 0 && this.delta < 0 || delta > 0 && this.delta === false) {
      state.direction = SCROLL_DIRS.DOWN;
    } else {
      state.direction = this.state.direction;
    }

    state.pinned = (this.lastY < this.props.topThreshold);

    if (Math.abs(delta) > this.props.deltaThreshold) {
      state.show = state.direction === SCROLL_DIRS.UP;
    }

    this.delta = delta;
    this.commitY = this.lastY;

    this.setState(state, () => {
      this.ticking = false;
    });
  }

  render() {
    const { children } = this.props;

    return children(this.state)
  }
}

export default ScrollReact;
