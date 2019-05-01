import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Options.scss";

class Options extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className } = this.props;

    const cls = classNames(
      className,
      'options'
    );

    return (
      <div className={cls}>
        Options
      </div>
    );
  }
}

export default Options;
