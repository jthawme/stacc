import React from 'react';
import PropTypes from 'prop-types';

// 3rd Party Modules
import classNames from 'classnames';

// Redux

// Components
import VideoEditor from '../VideoEditor/VideoEditor';

// CSS, Requires
import "./Home.scss";

class Home extends React.Component {
  static propTypes = {
  };

  render() {
    const cls = classNames(
      'home'
    );

    return (
      <div className={cls}>
        <VideoEditor
          total={ 6000 }/>
        
        <button className={'home__export'}>Export</button>
      </div>
    );
  }
}

export default Home;
