import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Nav.scss";

class Nav extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    navLinks: [
      {
        href: 'home',
        label: 'Video'
      }
    ]
  }

  renderLinks = (links) => {
    return links.map(l => {
      const cls = classNames(
        'nav__links__link',
        {
          'nav__links__link--active': this.props.location === l.href
        }
      );

      return (
        <li key={l.href}>
          <button className={cls} onClick={() => this.onNavRequest(l.href)}>{ l.label }</button>
        </li>
      );
    });
  }

  render() {
    const { navLinks } = this.state;
    const { className } = this.props;

    const cls = classNames(
      className,
      'nav'
    );

    return (
      <nav className={cls}>
        <ul className="nav__links">
          { this.renderLinks(navLinks) }
        </ul>
      </nav>
    );
  }
}

export default Nav;
