import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Incrementer.scss";

class Incrementer extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    increment: 1
  };

  onClick = () => {
    const { value, increment, max, min, name } = this.props;

    let next = value + increment;

    if (next > max) {
      next = min;
    }

    this.props.onUpdate(next, name)
  }

  render() {
    const { className, disabled, value, label } = this.props;

    const cls = classNames(
      className,
      'incrementer'
    );

    return (
      <div className={cls}>
        { label ? label : null }
        <button disabled={disabled} onClick={this.onClick} className="incrementer__input">{ value }</button>
      </div>
    );
  }
}

export default Incrementer;
