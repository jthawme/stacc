import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import { SIZES, SPEEDS } from '../Common/constants'
import "./Progress.scss";

class Progress extends React.Component {
  static propTypes = {
    className: PropTypes.string,

    /** Float 0-1 */
    percent: PropTypes.number,

    size: PropTypes.oneOf(['small', 'medium', 'large']),

    displayUnit: PropTypes.bool,
    displayFunc: PropTypes.func,
  };

  static defaultProps = {
    percent: 0,
    size: SIZES.MEDIUM,
    speed: SPEEDS.NORMAL,
    displayUnit: false,
    displayFunc: (value) => value.toFixed(2)
  };

  renderPercent(percent, displayFunc) {
    if (!displayFunc || typeof displayFunc !== 'function') {
      return <div className={'ui-progress__unit'}>percent</div>;
    }

    return displayFunc(percent);
  }

  render() {
    const { className, percent, size, speed, displayFunc, displayUnit } = this.props;

    const cls = classNames(
      className,
      'ui-progress',
      `ui-progress__${size}`,
      `ui-progress__${speed}`,
    );

    const style = {
      transform: `scaleX(${ percent })`
    };

    return (
      <div className={cls}>
        <div className={'ui-progress__track'}>
          <div className={'ui-progress__bar'} style={style}/>
        </div>
        { displayUnit ? this.renderPercent(percent, displayFunc) : null }
      </div>
    );
  }
}

export default Progress;
