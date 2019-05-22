import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./GenericInput.scss";

class GenericInput extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    local: PropTypes.bool,
    children: PropTypes.func,
  };

  static defaultProps = {
    local: false
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  onChange = (value) => {
    if (this.props.local) {
      this.setState({ value });
    } else {
      this.props.onUpdate(value);
    }
  }

  onBlur = (e) => {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }

    if (this.props.local) {
      this.props.onUpdate(this.state.value);
    }
  }

  renderInput(child) {
    return child({
      onChange: this.onChange,
      onBlur: this.onBlur,
      localValue: this.state.value
    })
  }

  render() {
    const { className, label, children, type, noLine } = this.props;

    const cls = classNames(
      className,
      'ui-input__label',
      `ui-input__${type}`
    );

    return (
      <label className={cls}>
        { label ? (
          <span className={'ui-input__title'}>{ label }</span>
        ) : null }
        { this.renderInput(children) }
        { !noLine ? (
          <span className={'ui-input__underline'}/>
        ) : null }
      </label>
    );
  }
}

export default GenericInput;
