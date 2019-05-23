import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Headbar.scss";

class Headbar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    local: PropTypes.bool
  };

  static defaultProps = {
    local: false
  };

  componentDidMount() {
    if (!this.props.local) {
      this.createPortalMount();
    }
  }

  createPortalMount() {
    // Not sure if it needs to check if
    // it already exists
    const el = document.createElement('header');
    el.classList.add('ui-headbar');
    document.body.insertBefore(el, document.body.firstChild);

    this.mount = el;
  }

  render() {
    const { className, pinned, show, direction, children, local } = this.props;

    const wrapperCls = classNames(
      'ui-headbar',
      {
        ['ui-headbar__local']: local
      }
    );

    const cls = classNames(
      className,
      'ui-headbar__content',
      {
        ['ui-headbar__pinned']: pinned
      },
      {
        ['ui-headbar__show']: show
      }
    );

    if (!this.mount && !local) {
      return null;
    }

    const content = (
      <div className={cls}>
        { children }
      </div>
    );

    if (local) {
      return (
        <header className={wrapperCls}>
          { content }
        </header>
      )
    } else {
      return ReactDOM.createPortal(content, this.mount)
    }
  }
}

export default Headbar;
