import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles.css';
import AppWrapper from './AppWrapper';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');

// Use createRoot from react-dom/client
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

reportWebVitals();