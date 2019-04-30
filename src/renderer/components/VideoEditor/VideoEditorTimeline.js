import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./VideoEditorTimeline.scss";

class VideoEditorTimeline extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.controlRef = null;
    this.leftHandle = React.createRef();
    this.rightHandle = React.createRef();

    this.active = false;

    this.state = {
      leftX: 0,
      rightX: 1,
      totalWidth: 100
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.start !== this.props.start || oldProps.end !== this.props.end) {
      this.setState({
        leftX: this.props.start,
        rightX: this.props.end
      });

      // this.deltaRightX = this.totalWidth * this.props.end;
      // this.deltaLeftX = this.totalWidth * this.props.start;
    }
  }

  onMouseDown = e => {
    if (e.target === this.leftHandle.current || e.target === this.rightHandle.current) {
      this.active = e.target === this.leftHandle.current ? 'left' : 'right';
      requestAnimationFrame(this.updateLoop);
    }
  }

  onMouseMove = e => {
    if (this.active) {
      let calc = (e.pageX - this.controlRef.offsetLeft) / this.state.totalWidth;
      if (this.active == 'left') {
        this.deltaLeftX = calc;
      } else {
        this.deltaRightX = calc;
      }
    }
  }

  updateLoop = () => {
    if (this.active) {
      requestAnimationFrame(this.updateLoop);
    }

    let left = this.clamp(this.deltaLeftX || 0, 0, 1);
    let right = this.clamp(this.deltaRightX || 1, 0, 1);

    if (left >= right) {
      left = right - 0.05;
    } else if (right <= left) {
      right = left + 0.05;
    }

    this.setState({
      leftX: left,
      rightX: right
    });
  }

  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  onMouseUp = e => {
    if (this.active) {
      this.active = false;
      this.props.onValueChange(this.state.leftX, this.state.rightX);
    }
  }

  onMouseLeave = e => {
    this.onMouseUp();
  }

  handleRef = ref => {
    this.controlRef = ref;

    this.setState({
      totalWidth: ref.clientWidth
    });
  }

  render() {
    const { className } = this.props;
    const { leftX, rightX } = this.state;

    const cls = classNames(
      className,
      'videoeditortimeline'
    );

    const trackStyle = {
      transform: `translate3d(${leftX * this.state.totalWidth}px, 0, 0) scaleX(${ rightX - leftX })`
    };

    return (
      <div className={cls}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseLeave}
        ref={this.handleRef}>
        <div className="videoeditortimeline__track" style={trackStyle}/>
        <div
          ref={this.leftHandle}
          className="videoeditortimeline__handle videoeditortimeline__handle--left"
          style={{
            transform: `translate3d(${leftX * (this.state.totalWidth - 24)}px, -50%, 0)`
          }}
          />
        <div
          ref={this.rightHandle}
          className="videoeditortimeline__handle videoeditortimeline__handle--right"
          style={{
            transform: `translate3d(${rightX * (this.state.totalWidth - 24)}px, -50%, 0)`
          }}
          />
      </div>
    );
  }
}

export default VideoEditorTimeline;
