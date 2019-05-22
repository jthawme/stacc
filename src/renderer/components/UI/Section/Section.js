import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./Section.scss";

class Section extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    subtitle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    card: PropTypes.bool,
    inline: PropTypes.bool
  };

  renderTitle(title) {
    if (typeof title === 'string') {
      return (
        <div className={'ui-section__title'}>
          { title }
        </div>
      );
    }

    return title;
  }

  renderSubtitle(subtitle) {
    if (typeof subtitle === 'string') {
      return (
        <div className={'ui-section__subtitle'}>
          { subtitle }
        </div>
      );
    }

    return subtitle;
  }

  render() {
    const { className, title, subtitle, children, card, inline } = this.props;

    const cls = classNames(
      className,
      'ui-section',
      {
        ['ui-section__card']: card
      },
      {
        ['ui-section__inline']: inline
      }
    );

    return (
      <div className={cls}>
        <div className={'ui-section__heading'}>
          { title ? this.renderTitle(title) : null }
          { subtitle ? this.renderSubtitle(subtitle) : null }
        </div>
        <div className={'ui-section__content'}>
          { children }
        </div>
      </div>
    );
  }
}

export default React.memo(Section);
