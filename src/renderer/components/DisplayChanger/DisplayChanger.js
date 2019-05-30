import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./DisplayChanger.scss";

class DisplayChanger extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    display: false
  };

  componentDidUpdate(oldProps) {
    if (oldProps.type !== this.props.type) {
      this.startTimer();
    }
  }

  startTimer() {
    clearTimeout(this.timer);

    this.setState({
      display: true
    });

    this.timer = setTimeout(() => {
      this.setState({
        display: false
      });
    }, 2000);
  }

  render() {
    const { className, type } = this.props;
    const { display } = this.state;

    const cls = classNames(
      className,
      'displaychanger',
      {
        'displaychanger--display': display
      }
    );

    return (
      <div className={cls}>{ type }</div>
    );
  }
}

export default DisplayChanger;
