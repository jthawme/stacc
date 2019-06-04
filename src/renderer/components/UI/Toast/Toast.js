import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import Slider from '../Slider/Slider';

// CSS, Requires
import { TYPES } from '../Common/constants';
import "./Toast.scss";
import "../Button/Button.scss";

class Toast extends React.Component {
  static propTypes = {
    className: PropTypes.string,

    timeout: PropTypes.number,
    type: PropTypes.string,
    outlined: PropTypes.bool,
    full: PropTypes.bool,
  };

  static defaultProps = {
    timeout: 2500,
    type: TYPES.NORMAL,
    outlined: false,
    full: false
  };

  state = {
    closed: false
  };

  componentDidMount() {
    this.setTimer();
  }

  setTimer() {
    this.timer = setTimeout(() => {
      this.setState({
        closed: true
      });
    }, this.props.timeout);
  }

  onClosed = () => {
    this.props.onFinished(this.props.id);
  }

  render() {
    const { className, message, type, outlined, full } = this.props;
    const { closed } = this.state;

    const cls = classNames(
      className,
      'ui-toast',
      `ui-button__${type}`,
      {
        'ui-toast__full': full
      },
      {
        'ui-button__outlined': outlined
      },
      {
        'ui-toast__outlined': outlined
      }
    );

    const innerCls = classNames(
      'ui-toast__inner',
    );

    return (
      <Slider
        speed="normal"
        onClosed={this.onClosed}
        closed={closed}
        className={cls}>
        { typeof message === 'string' ? (
          <div className={'ui-toast__content'}>
            <div className={innerCls}>{ message }</div>
          </div>
        ) : message }
      </Slider>
    );
  }
}

export default Toast;
