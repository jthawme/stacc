import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Iconer, { SIZES } from '../Iconer/Iconer';
import Btn from './Btn';

// CSS, Requires
import "./BtnIcon.scss";

class BtnIcon extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOf(Object.values(SIZES)),
    invert: PropTypes.bool
  };

  static defaultProps = {
    onClick: () => {},
    size: SIZES.MEDIUM,
    invert: true
  };

  render() {
    const { className, icon, size, ...props } = this.props;

    const cls = classNames(
      className,
      'btnicon',
      `btnicon--${ size }`
    );

    return (
      <Btn className={cls} {...props}>
        <Iconer icon={icon} size={ size }/>
      </Btn>
    );
  }
}

export default BtnIcon;
