import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import AccordionRow from './AccordionRow';

// CSS, Requires
import styles from "./Accordion.module.scss";

class Accordion extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    open: []
  };

  renderRow = (child, index) => {
    return React.cloneElement(child, {
      onToggle: () => this.onToggle(index),
      closed: this.state.open.indexOf(index) < 0
    });
  }

  onToggle(index) {
    let open = this.state.open.slice();
    const idx = open.indexOf(index);

    if (idx >= 0) {
      open.splice(idx, 1);
    } else {
      if (this.props.multi) {
        open.push(index);
      } else {
        open = [index];
      }
    }

    this.setState({ open });
  }

  render() {
    const { className, children } = this.props;

    const cls = classNames(
      className,
      styles.accordion
    );

    return (
      <div className={cls}>
        { React.Children.map(children, this.renderRow) }
      </div>
    );
  }
}

export { AccordionRow };
export default Accordion;
