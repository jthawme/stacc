import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Iconer.scss";

const iconReq = require.context('!!svg-inline-loader!./icons', false, /\.svg/);

export const SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge'
};

class Iconer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    size: PropTypes.oneOf(Object.values(SIZES))
  };

  static defaultProps = {
    size: SIZES.MEDIUM
  };

  getIcon(key) {
    const keys = iconReq.keys();
    const target = `./${key}.svg`;

    if (keys.indexOf(target) >= 0) {
      return iconReq(target);
    } else {
      return false;
    }
  }

  render() {
    const { className, icon, size } = this.props;

    const cls = classNames(
      className,
      'iconer',
      [`iconer--${ size }`]
    );

    return (
      <span className={cls} dangerouslySetInnerHTML={{__html: this.getIcon(icon)}}/>
    );
  }
}

export default Iconer;
