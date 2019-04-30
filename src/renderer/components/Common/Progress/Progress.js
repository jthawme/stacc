import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Progress.scss";

class Progress extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className, percent } = this.props;

    const cls = classNames(
      className,
      'progress'
    );

    return (
      <div className={cls}>
        <div className="progress__track" style={{ transform: `scaleX(${ percent })`}}/>
      </div>
    );
  }
}

export default Progress;
