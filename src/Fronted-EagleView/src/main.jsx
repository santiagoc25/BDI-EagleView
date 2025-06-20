/*
 main.jsx: The application's entry point.
 This file handles rendering the main `App` component into the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
 // The application's root component
import App from './App.jsx';

// Global styles to be applied across the entire app
import './styles/GlobalStyles.css'; 

// Render the application into the <div id="root"> element in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode helps to identify potential problems in an app.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);