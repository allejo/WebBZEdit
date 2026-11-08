import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import 'bootstrap/dist/css/bootstrap-utilities.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';

import App from './App';
import ThumbnailSheet from './Thumbnails/ThumbnailSheet';

import './css/global.css';
import './css/typography.css';
import a11yPatterns from './sass/a11yPatterns.module.scss';
import './sass/spacing.scss';

// Enable color blind patterns for the page
const body = document.getElementsByTagName('body');
body.item(0).classList.add(a11yPatterns.usePatterns);

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      {window.location.search === '?thumbnails' ? <ThumbnailSheet /> : <App />}
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);
