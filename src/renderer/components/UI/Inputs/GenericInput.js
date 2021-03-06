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
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    local: PropTypes.bool,
    children: PropTypes.func,
    name: PropTypes.string
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
      this.update(value);
    }
  }

  onBlur = (e) => {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }

    if (this.props.local) {
      this.update(this.state.value);
    }
  }

  update(value) {
    this.props.onUpdate(value, this.props.name);
  }

  renderInput(child) {
    return child({
      onChange: this.onChange,
      onBlur: this.onBlur,
      localValue: this.state.value
    })
  }

  renderLabel(label) {
    if (typeof label === 'object') {
      return label;
    }

    return <span className={'ui-input__title'}>{ label }</span>
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
        { label ? this.renderLabel(label) : null }
        { this.renderInput(children) }
        { !noLine ? (
          <span className={'ui-input__underline'}/>
        ) : null }
      </label>
    );
  }
}

export default GenericInput;
