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
    className: PropTypes.string
  };

  static defaultProps = {
    onClick: () => {}
  };

  render() {
    const { className, icon, size, onClick } = this.props;

    const cls = classNames(
      className,
      'btnicon'
    );

    return (
      <Btn className={cls} onClick={onClick}>
        <Iconer icon={icon} size={ size }/>
      </Btn>
    );
  }
}

export default BtnIcon;
