import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import BtnIcon from '../../Common/Btn/BtnIcon';
import Iconer from '../../Common/Iconer/Iconer';

// CSS, Requires
import "./OptionChecked.scss";

class OptionChecked extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  onChange = e => {
    this.props.onChange(this.props.name, e.target.checked);
  }

  onFakeChange = e => {
    this.props.onChange(this.props.name, !this.props.value);
  }

  render() {
    const { className, value } = this.props;

    const cls = classNames(
      className,
      'optionchecked',
      {
        'optionchecked--checked': value
      }
    );

    return (
      <div className={cls}>
        <BtnIcon
          className="optionchecked__box"
          onClick={this.onFakeChange}
          icon={ value ? 'checkmark' : 'close' }
          size="large"/>
      </div>
    );
  }
}

export default OptionChecked;
