import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./DropDisplay.scss";

const random = (min, max) => {
  return ((max - min) * Math.random()) + min;
}

class DropDisplay extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    characters: []
  };

  componentDidMount() {
    this.setState({
      characters: this.getCharacters('Drop a video file here')
    });
  }

  getCharacters(text) {
    let min = 200;
    let max = 800;
    return text.split('').map((c, index) => {
      if (index < 4) {
        return {
          char: c,
          x: `0%`,
          y: `0%`,
        }
      }

      return {
        char: c,
        x: `${index % 2 ? random(max * -1, min * -1) : random(min, max)}%`,
        y: `${index % 2 ? random(min, max) : random(max * -1, min * -1)}%`,
      }
    });
  }

  renderCharacter = (curr, index) => {
    return (
      <span key={index} style={{
        '--x-transform': curr.x,
        '--y-transform': curr.y,
      }}>{curr.char}</span>
    )
  }

  render() {
    const { className, dropping, hasFiles } = this.props;
    const { characters } = this.state;

    const cls = classNames(
      className,
      'dropdisplay',
      {
        'dropdisplay--dropping': dropping
      },
      {
        'dropdisplay--hidden': hasFiles && !dropping
      }
    );

    return (
      <div className={cls}>
        <div className="dropdisplay__content">
          { characters.map(this.renderCharacter) }
        </div>
      </div>
    );
  }
}

export default DropDisplay;
