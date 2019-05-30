import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./TimeInput.scss";

function padTime(value) {
	return value.toString().padStart(2, '0');
}

class TimeInput extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    parts: []
  }

  componentDidMount() {
    this.setState({
      parts: this.toTime(this.props.value)
    });
  }

  componentDidUpdate(oldProps) {
    if (oldProps.value !== this.props.value) {
      this.setState({
        parts: this.toTime(this.props.value)
      });
    }
  }

  toNumber(value) {
    const time = value.split(':');
    time.reverse();

    let num = 0;

    for (let i = 0; i < time.length; i++) {
      if (i === 0) {
        num += time[i] * 10;
      }
      if (i === 1) {
        num += time[i] * 1000;
      }
      if (i === 2) {
        num += (time[i] * 1000) * 60;
      }
      if (i === 3) {
        num += ((time[i] * 1000) * 60) * 60;
      }
    }

    return num;
  }

  toTime(value) {
    const hours = Math.floor(((value / 1000) / 60) / 60) % 60;
    const minutes = Math.floor((value / 1000) / 60) % 60;
    const seconds = Math.floor((value / 1000)) % 60;
    const milliseconds = (value % 1000) / 10;

    let str = [
      padTime(minutes),
      padTime(seconds),
      padTime(milliseconds)
    ];

    if (hours > 0) {
      str.unshift(padTime(hours));
    }

    return str;
  }

  onChange = e => {
    const key = parseInt(e.target.name);
    const parts = this.state.parts.slice();

    parts[key] = e.target.value;

    this.setState({ parts });
  }

  onCommit = () => {
    this.props.onUpdate(this.toNumber(this.state.parts.join(':')), this.props.name);
  }

  render() {
    const { className } = this.props;
    const { parts } = this.state;

    const cls = classNames(
      className,
      'timeinput'
    );

    return (
      <div className={cls}>
        {
          parts.map((t, index) => {
            return (
              <input
                key={index}
                className="timeinput__input"
                type="text"
                name={index}
                value={t}
                onChange={this.onChange}
                onBlur={this.onCommit}/>
            )
          })
        }
      </div>
    );
  }
}

export default TimeInput;
