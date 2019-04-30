import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Switcher.scss";

class Switcher extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  getCurrentRoute(children, location) {
    return React.Children.map(children, (child) => {
      if (child.key === location) {
        return child;
      } else {
        return null;
      }
    });
  }

  render() {
    const { children, location } = this.props;

    return this.getCurrentRoute(children, location);
  }
}

export default React.memo(Switcher);
