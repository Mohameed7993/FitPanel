import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import 'bootstrap/dist/css/bootstrap.min.css'
import { ThemeProvider } from './pages/context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);




