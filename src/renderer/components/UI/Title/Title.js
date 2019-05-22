import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import { SIZES } from '../Common/constants';
import "./Title.scss";

class Title extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOf(Object.values(SIZES)),
    el: PropTypes.string
  };

  static defaultProps = {
    size: SIZES.MEDIUM,
    el: 'h1'
  };

  render() {
    const { className, size, el, children } = this.props;

    const cls = classNames(
      className,
      'ui-title',
      `ui-title__${size}`
    );

    const ElName = el;
    return <ElName className={cls}>{ children }</ElName>;
  }
}

export default React.memo(Title);
