import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import { TYPES } from '../Common/constants';
import "./GenericInput.scss";
import GenericInput from './GenericInput';

class TextInput extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    local: PropTypes.bool,
    type: PropTypes.string,

    onChange: PropTypes.func,
  };

  static defaultProps = {
    local: false,
    type: TYPES.NORMAL,
    onUpdate: () => {}
  };

  onChange(evt, onChange) {
    onChange(evt.target.value);
  }

  render() {
    const { className, label, placeholder, value, local, type, onUpdate } = this.props;

    const cls = classNames(
      'ui-input__input',
    );

    return (
      <GenericInput
        className={className}
        local={local}
        label={label}
        type={type}
        onUpdate={onUpdate}>
        {
          ({ onChange, onBlur, localValue }) => (
            <input
              className={cls}
              type="text"
              placeholder={placeholder}
              onChange={e => this.onChange(e, onChange)}
              onBlur={onBlur}
              value={local ? localValue : value}/>
          )
        }
      </GenericInput>
    );
  }
}

export default React.memo(TextInput);
