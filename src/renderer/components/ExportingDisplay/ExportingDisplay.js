import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components

// CSS, Requires
import "./ExportingDisplay.scss";

class ExportingDisplay extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  state = {
    display: false
  };

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({
        display: true
      });
    }, 250);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { className } = this.props;
    const { display } = this.state;

    const cls = classNames(
      className,
      'exportingdisplay',
      {
        'exportingdisplay--display': display
      }
    );

    return (
      <div className={cls}>
        <div className="exportingdisplay__content">
          { 'exporting'.split('').map((s, index) => <div key={index} className="export-square">{ s }</div>) }
        </div>
      </div>
    );
  }
}

export default ExportingDisplay;
