import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Slider from '../Slider/Slider';
import Icon from '../Icon/Icon';

// CSS, Requires
import "./AccordionRow.scss";

class AccordionRow extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    noIcon: PropTypes.bool
  };

  renderTitle(title) {
    if (typeof title === 'string') {
      return (
        <span size="small" className={'accordionrow__title'}>
          { title }
        </span>
      );
    }

    return title;
  }

  render() {
    const { className, title, closed, onToggle, noIcon, children } = this.props;

    const cls = classNames(
      className,
      'accordionrow'
    );

    return (
      <div className={cls}>
        <div onClick={onToggle} className={'accordionrow__heading'}>
          { this.renderTitle(title) }

          { noIcon ? null : (
            <Icon
              size="small"
              icon={closed ? 'add' : 'remove'}/>
          ) }
        </div>
        <Slider
          closed={closed}>
          { children }
        </Slider>
      </div>
    );
  }
}

export default AccordionRow;
