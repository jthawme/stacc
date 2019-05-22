import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Icon from '../Icon/Icon';

// CSS, Requires
import { SIZES, TYPES } from '../Common/constants';
import "./Button.scss";

class Button extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    size: PropTypes.oneOf(Object.values(SIZES)),
    type: PropTypes.oneOf(Object.values(TYPES)),
    noMargin: PropTypes.bool,
    outlined: PropTypes.bool,
    icon: PropTypes.string,
    rounded: PropTypes.bool,
    el: PropTypes.string,
  };

  static defaultProps = {
    size: SIZES.MEDIUM,
    type: TYPES.NORMAL,
    el: 'button'
  };

  renderIcon(icon, size) {
    if (!icon) {
      return null;
    }

    return <Icon className={'ui-button__icon'} icon={icon} size={size}/>;
  }

  render() {
    const { className, children, size, noMargin, outlined, type, icon, rounded, el, ...props } = this.props;

    const cls = classNames(
      className,
      'ui-button',
      `ui-button__${size}`,
      `ui-button__${type}`,
      {
        'ui-button__hoverable': !props.disabled
      },
      {
        'ui-button__noMargin': noMargin
      },
      {
        'ui-button__outlined': outlined
      },
      {
        'ui-button__noText': React.Children.count(children) === 0
      },
      {
        'ui-button__rounded': rounded
      }
    );

    const ElName = el ? el : 'button';
    return <ElName className={cls} {...props}>{ this.renderIcon(icon, size) }{ children }</ElName>;
  }
}

export default Button;
