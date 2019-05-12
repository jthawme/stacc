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

  renderChildren(children, disabled) {
    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        disabled
      });
    });
  }

  render() {
    const { className, children, title, subtitle, disabled } = this.props;

    const cls = classNames(
      className,
      'optionrow',
      {
        'optionrow--disabled': disabled
      }
    );

    return (
      <div className={cls}>
        <div className="optionrow__title">
          <span>{ title }</span>
          <span>{ subtitle }</span>
        </div>
        <div className="optionrow__content">
          { this.renderChildren(children, disabled) }
        </div>
      </div>
    );
  }
}

export default OptionRow;
