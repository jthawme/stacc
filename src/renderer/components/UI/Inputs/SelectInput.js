import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Button from '../Button/Button';
import Slider from '../Slider/Slider';

// CSS, Requires
import { TYPES } from '../Common/constants';
import "./SelectInput.scss";
import GenericInput from './GenericInput';

class SelectInput extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,

    placeholder: PropTypes.string,

    onChange: PropTypes.func,

    contentClassName: PropTypes.string,
    optionsClassName: PropTypes.string,

    optionItem: PropTypes.func,
    triggerItem: PropTypes.func
  };

  static defaultProps = {
    placeholder: 'Select...',
    local: false,
    type: TYPES.NORMAL,
    onUpdate: () => {}
  };

  state = {
    optionsOpen: false
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  onChange(evt, onChange) {
    onChange(evt.target.value);
  }

  toggleOptions = () => {
    this.setOptionsState(!this.state.optionsOpen);
  }

  setOptionsState = state => {
    this.setState({ optionsOpen: state });
  }

  setRef = ref => {
    this.ref = ref;
  }

  handleOutsideClick = evt => {
    if (this.ref && !this.ref.contains(evt.target)) {
      this.setOptionsState(false);
    }
  }

  getLabelFromValue(value, options, placeholder = '') {
    let val = options.find(opt => opt.value === value);

    if (!val) {
      return placeholder;
    } else {
      return val.label;
    }
  }

  renderOption = opt => {
    return (
      <option
        key={opt.value}
        value={opt.value}
        disabled={opt.disabled}>
        {opt.label}
      </option>
    );
  }

  renderVisualOption = (opt, onChange) => {
    const { optionItem, value } = this.props;
    if (optionItem) {
      return (
        <li key={opt.value} onClick={() => {
          if (!opt.disabled) {
            this.setOptionsState(false);
            onChange(opt.value)
          }
        }}>
          { optionItem(opt, value === opt.value, opt.disabled) }
        </li>
      );
    }

    return (
      <li
        key={opt.value}
        disabled={opt.disabled}
        onClick={() => {
          this.setOptionsState(false);
          onChange(opt.value)
        }}>
        {opt.label}
      </li>
    );
  }

  renderTrigger = () => {
    const { value, options, placeholder, triggerItem } = this.props;
    const label = this.getLabelFromValue(value, options, placeholder);

    if (triggerItem) {
      return (
        <span onClick={this.toggleOptions}>
          { triggerItem(label) }
        </span>
      );
    }

    return (
      <span onClick={this.toggleOptions}>
        { label }
      </span>
    );
  }

  render() {
    const { className, label, options, value, type, onUpdate, name, contentClassName, optionsClassName } = this.props;
    const { optionsOpen } = this.state;

    const contentCls = classNames(
      'ui-select__content',
      contentClassName
    );

    const optionsCls = classNames(
      'ui-select__options',
      optionsClassName
    );

    return (
      <GenericInput
        className={className}
        label={label}
        type={type}
        name={name}
        onUpdate={onUpdate}
        clickable={false}
        noLine>
        {
          ({ onChange, onBlur }) => (
            <div className={contentCls} ref={this.setRef}>
              <Slider className={optionsCls} closed={!optionsOpen}>
                <ul>
                  { options.map(opt => this.renderVisualOption(opt, onChange)) }
                </ul>
              </Slider>
              { this.renderTrigger() }
              <select
                name={name}
                className={'ui-select__select'}
                onChange={e => this.onChange(e, onChange)}
                onBlur={onBlur}
                value={value}>
                { options.map(this.renderOption)}
              </select>
            </div>
          )
        }
      </GenericInput>
    );
  }
}

export default React.memo(SelectInput);
