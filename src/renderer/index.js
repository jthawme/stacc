import React from 'react';
import ReactDOM from 'react-dom';

// import './utils/fonts';
// import './utils/polyfills';

import App from './components/App/App';
import Settings from './components/Settings/Settings';

if (global.location.search.includes('settings')) {
  ReactDOM.render(<Settings/>, document.getElementById('app'));
} else {
  ReactDOM.render(<App/>, document.getElementById('app'));
}
