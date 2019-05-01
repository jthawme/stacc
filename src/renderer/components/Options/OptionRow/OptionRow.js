import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./OptionRow.scss";

class OptionRow extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className, children, title, subtitle } = this.props;

    const cls = classNames(
      className,
      'optionrow'
    );

    return (
      <div className={cls}>
        <div className="optionrow__title">
          <span>{ title }</span>
          <span>{ subtitle ? subtitle : '-' }</span>
        </div>
        <div className="optionrow__content">
          { children }
        </div>
      </div>
    );
  }
}

export default OptionRow;
