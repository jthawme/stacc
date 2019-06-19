import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Button from '../../UI/Button/Button';

// CSS, Requires
import "../SizeChanger/SizeChanger.scss";

import { calcSum, isSum } from '../SizeChanger/SizeChanger';

class FrameRateChanger extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      fps: props.fps,
      scaledFps: props.scaledFps
    };
  }

  componentDidMount() {
    this.calculateFps(this.props.fps, this.props.scaledFps);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.fps !== this.props.fps || oldProps.scaledFps !== this.props.scaledFps) {
      this.calculateFps(this.props.fps, this.props.scaledFps);
    }
  }

  calculateFps(fps, scale) {
    this.setState({
      fps: fps / scale
    });
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onBlur = e => {
    let val = e.target.value;
    const primary = e.target.name;

    if (isSum(val)) {
      val = calcSum(val);
    }

    if (isNaN(parseInt(val))) {
      val = this.props[primary];
    }

    const factor = this.props[primary] / parseFloat(val);

    this.setState({
      [primary]: this.round(parseFloat(val), 2),
      scaledFps: factor
    }, this.onUpdate);
  }

  onFocus = e => {
    e.target.select();
  }

  round = (num, decimal) => {
    return Math.round(num * (10 * decimal)) / (10 * decimal);
  }

  onReset = e => {
    this.setState({
      fps: this.props.fps,
      scaledFps: 1
    }, this.onUpdate);
  }

  onUpdate() {
    this.props.onChange('scaledFps', this.state.scaledFps);
  }

  render() {
    const { className } = this.props;
    const { fps } = this.state;

    const cls = classNames(
      className,
      'changer'
    );

    return (
      <div className={cls}>
        <input
          type="text"
          name="fps"
          onFocus={this.onFocus}
          onChange={this.onChange}
          onBlur={this.onBlur}
          value={fps}/>
        <div className="changer__meta">
          <Button
            onClick={this.onReset}
            noMargin
            type="minimal"
            size="small"
            icon="refresh">
            Reset
          </Button>
        </div>
      </div>
    );
  }
}

export default FrameRateChanger;
