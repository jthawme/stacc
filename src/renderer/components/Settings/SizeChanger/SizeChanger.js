import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./SizeChanger.scss";
import Button from '../../UI/Button/Button';

export const getStringOperator = (str) => {
  const operators = ['-', '+', '/', '*'];

  return operators.find(o => str.includes(o));
};

export const isSum = (str) => {
  const operator = getStringOperator(str);

  if (!operator) {
    return false;
  } {
    const split = str.split(operator);

    return split.length == 2 && split.every(n => !isNaN(parseFloat(n)));
  }
};

export const calcSum = (val) => {
  const operator = getStringOperator(val);
  const nums = val.split(operator).map(v => parseFloat(v));

  const maths = {
    '-': (one, two) => one - two,
    '+': (one, two) => one + two,
    '/': (one, two) => one / two,
    '*': (one, two) => one * two,
  }

  return maths[operator](nums[0], nums[1]);
};

class SizeChanger extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      width: props.width,
      height: props.height,
      scaledDown: props.scaledDown
    };
  }

  componentDidMount() {
    this.calculateSizes(this.props.width, this.props.height, this.props.scaledDown);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.width !== this.props.width || oldProps.height !== this.props.height || oldProps.scaledDown !== this.props.scaledDown) {
      this.calculateSizes(this.props.width, this.props.height, this.props.scaledDown);
    }
  }

  calculateSizes(width, height, scale) {
    this.setState({
      width: this.round(width / scale, 2),
      height: this.round(height / scale, 2)
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
    const secondary = primary == 'width' ? 'height' : 'width';

    if (isSum(val)) {
      val = calcSum(val);
    }

    if (isNaN(parseInt(val))) {
      val = this.props[primary];
    }

    const factor = this.props[primary] / parseFloat(val);

    this.setState({
      [primary]: this.round(parseFloat(val), 2),
      [secondary]: this.round(parseFloat(this.props[secondary] / factor), 2),
      scaledDown: factor
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
      width: this.props.width,
      height: this.props.height,
      scaledDown: 1
    }, this.onUpdate);
  }

  onUpdate() {
    this.props.onChange('scaledDown', this.state.scaledDown);
  }

  render() {
    const { className } = this.props;
    const { width, height } = this.state;

    const cls = classNames(
      className,
      'changer'
    );

    return (
      <div className={cls}>
        <input
          type="text"
          name="width"
          onFocus={this.onFocus}
          onChange={this.onChange}
          onBlur={this.onBlur}
          value={width}/>
        <input
          type="text"
          name="height"
          onFocus={this.onFocus}
          onChange={this.onChange}
          onBlur={this.onBlur}
          value={height}/>
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

export default SizeChanger;
