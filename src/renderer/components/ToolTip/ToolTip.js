import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./ToolTip.scss";

class ToolTip extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    timeout: PropTypes.number,
    tip: PropTypes.string
  };

  static defaultProps = {
    timeout: 500
  };

  state = {
    display: false
  };

  onClick = e => {
    clearTimeout(this.timer);
    this.setState({ display: true });
  }

  onMouseEnter = e => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ display: true });
    }, this.props.timeout);
  }

  onMouseLeave = e => {
    clearTimeout(this.timer);
    this.setState({
      display: false
    });
  }

  render() {
    const { className, children, tip } = this.props;
    const { display } = this.state;

    const cls = classNames(
      className,
      'tooltip',
      {
        'tooltip--display': display
      }
    );

    return (
      <span className={cls} onClick={this.onClick} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <div className="tooltip__tip">{ tip }</div>
        { children }
      </span>
    );
  }
}

export default ToolTip;
