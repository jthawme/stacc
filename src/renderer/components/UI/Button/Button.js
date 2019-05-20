import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Icon from '../Icon/Icon';

// CSS, Requires
import { SIZES, TYPES } from '../Common/constants';
import styles from "./Button.module.scss";

class Button extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    size: PropTypes.oneOf(Object.values(SIZES)),
    type: PropTypes.oneOf(Object.values(TYPES)),
    noMargin: PropTypes.bool,
    outlined: PropTypes.bool,
    icon: PropTypes.string,
    rounded: PropTypes.bool
  };

  static defaultProps = {
    size: SIZES.MEDIUM,
    type: TYPES.NORMAL
  };

  renderIcon(icon, size) {
    if (!icon) {
      return null;
    }

    return <Icon className={styles.icon} icon={icon} size={size}/>;
  }

  render() {
    const { className, children, size, noMargin, outlined, type, icon, rounded, ...props } = this.props;

    const cls = classNames(
      className,
      styles.button,
      styles[size],
      styles[type],
      {
        [styles.hoverable]: !props.disabled
      },
      {
        [styles.noMargin]: noMargin
      },
      {
        [styles.outlined]: outlined
      },
      {
        [styles.noText]: React.Children.count(children) === 0
      },
      {
        [styles.rounded]: rounded
      }
    );

    return <button className={cls} {...props}>{ this.renderIcon(icon, size) }{ children }</button>;
  }
}

export default Button;
