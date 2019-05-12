import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import { remote } from 'electron';
import classNames from 'classnames';

// Redux

// Components
import Btn from '../Common/Btn/Btn';

// CSS, Requires
import { FILTERS } from '../../../modules/Constants';
import "./VideoChooser.scss";

class VideoChooser extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  onFileChoose = () => {
    remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: FILTERS.VIDEOS,
    }, this.onFileChooseCB);
  }

  onFileChooseCB = (filePaths) => {
    if (filePaths) {
      this.props.onFileChoose(filePaths[0]);
    }
  }

  render() {
    const { className, display, children } = this.props;

    const cls = classNames(
      className,
      'videochooser'
    );

    return (
      <div className={cls}>
        <Btn onClick={ this.onFileChoose }>Open</Btn>

        { display ? children : null }
      </div>
    );
  }
}

export default VideoChooser;
