import React from 'react';
import { createRoot } from 'react-dom/client';  // note: destructured import
import App from './App';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// find the container
const container = document.getElementById('root');
if (!container) {
  throw new Error('Could not find root element to mount React into');
}

// create and render
const root = createRoot(container);
root.render(<App />);
