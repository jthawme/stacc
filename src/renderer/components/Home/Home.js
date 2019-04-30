import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import { ipcRenderer, remote } from 'electron';
import classNames from 'classnames';
import Events from '../../../modules/Events';

// Redux

// Components
import Btn from '../Common/Btn/Btn';
import VideoEditor from '../VideoEditor/VideoEditor';

// CSS, Requires
import "./Home.scss";
import Video from '../Video/Video';

const FILTERS = {
  VIDEOS: [
    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'mov'] }
  ],
  GIFS: [
    { name: 'Gifs', extensions: ['gif'] }
  ]
}

class Home extends React.Component {
  static propTypes = {
  };

  state = {
    asGif: true,
    fileURL: false,
    targetURL: false
  }

  componentDidMount() {
    this.addEventListeners();
  }

  addEventListeners() {
    ipcRenderer.on(Events.FINISHED, (event, arg) => {
      console.log(arg);
    });
  }

  onFileChoose = () => {
    remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: FILTERS.VIDEOS,
    }, this.onFileChooseCB);
  }

  onFileChooseCB = (filePaths) => {
    if (filePaths) {
      this.setState({
        fileURL: filePaths[0]
      });

      ipcRenderer.send(Events.THUMBNAIL, JSON.stringify({
        input: filePaths[0]
      }));
    }
  }

  onExport = () => {
    remote.dialog.showSaveDialog({
        filters: this.state.asGif ? FILTERS.GIFS : FILTERS.VIDEOS,
    }, this.onExportCB);
  }

  onExportCB = (fileName) => {
    if (fileName) {
      this.setState({
        targetURL: fileName
      });

      ipcRenderer.send(Events.CONVERT, JSON.stringify({
        input: this.state.fileURL,
        output: this.state.targetURL
      }));
    }
}

  render() {
    const { fileURL } = this.state;

    const cls = classNames(
      'home'
    );

    return (
      <div className={cls}>
        <div className="home__row">
          {/* <Video url={ fileURL }/> */}
          <Btn onClick={this.onFileChoose}>Choose file</Btn>
        </div>
        {/* <VideoEditor
          total={ 6000 }/> */}

        <Btn className={'home__export'} onClick={this.onExport}>Export</Btn>
      </div>
    );
  }
}

export default Home;
