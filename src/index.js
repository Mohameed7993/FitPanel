import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import 'bootstrap/dist/css/bootstrap.min.css'
import { ThemeProvider } from './pages/context/ThemeContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);

// Register the service worker
serviceWorkerRegistration.register();


