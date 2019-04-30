import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import VideoEditorTimeline from './VideoEditorTimeline';

// CSS, Requires
import "./VideoEditor.scss";

class VideoEditor extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      start: 0,
      end: props.total,
      startVal: this.toDisplaySeconds(0),
      endVal: this.toDisplaySeconds(props.total),
      total: props.total
    };
  }

  toDisplaySeconds(seconds) {
    return [
      Math.floor(seconds / 1000).toString().padStart(2, '0'),
      Math.floor((seconds % 1000) / 10).toString().padStart(2, '0')
    ].join(':');
  }

  convertValue(val) {
    const split = val.split(':');

    if (split.length < 2 || split.length > 3) {
      return false;
    }

    return split.reverse().map((v, index) => {
      if (index === 0) {
        return v * 10;
      } else if (index === 1) {
        return v * 1000;
      }
    }).reduce((prev, curr) => prev + curr, 0);
  }

  onTimeBlur = (e) => {
    const converted = this.convertValue(e.target.value);
    const valKey = `${e.target.name}Val`;

    if (converted === false) {
      this.setState({
        [valKey]: this.state[e.target.name]
      });
    } else {
      this.setTime(e.target.name, converted);
    }
  }

  onTimeChange = (e) => {
    this.setState({
      [`${e.target.name}Val`]: e.target.value
    });
  }

  onValueChange = (start, end) => {
    this.setTime('start', start * this.state.total);
    this.setTime('end', end * this.state.total);
  }

  setTime(key, val) {
    const valKey = `${key}Val`;
    this.setState({
      [key]: val,
      [valKey]: this.toDisplaySeconds(val)
    });
  }

  render() {
    const { className } = this.props;
    const { startVal, endVal, start, end, total } = this.state;

    const cls = classNames(
      className,
      'videoeditor'
    );

    return (
      <div className={cls}>
        <div className="videoeditor__canvas">
          hey
        </div>
        <div className="videoeditor__control">
          <VideoEditorTimeline
            onValueChange={ this.onValueChange }
            start={ start / total }
            end={ end / total }
            total={ total }/>
        </div>
        <div className="videoeditor__starttime">
          <input type="text" name="start" value={ startVal } onChange={this.onTimeChange} onBlur={this.onTimeBlur}/>
        </div>
        <div className="videoeditor__endtime">
          <input type="text" name="end" value={ endVal } onChange={this.onTimeChange} onBlur={this.onTimeBlur}/>
        </div>
      </div>
    );
  }
}

export default VideoEditor;
