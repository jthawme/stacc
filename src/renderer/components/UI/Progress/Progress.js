import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import { SIZES, SPEEDS } from '../Common/constants'
import styles from "./Progress.module.scss";

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
      return percent;
    }

    return displayFunc(percent);
  }

  render() {
    const { className, percent, size, speed, displayFunc, displayUnit } = this.props;

    const cls = classNames(
      className,
      styles.progress,
      styles[size],
      styles[speed],
    );

    const style = {
      transform: `scaleX(${ percent })`
    };

    return (
      <div className={cls}>
        <div className={styles.track}>
          <div className={styles.bar} style={style}/>
        </div>
        { displayUnit ? (
          <div className={styles.unit}>{ this.renderPercent(percent, displayFunc) }</div>
        ) : null }
      </div>
    );
  }
}

export default Progress;
