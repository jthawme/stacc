import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./TimeEditor.scss";

class TimeEditor extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className } = this.props;

    const cls = classNames(
      className,
      'timeeditor'
    );

    return (
      <div className={cls}>
        TimeEditor
      </div>
    );
  }
}

export default TimeEditor;
