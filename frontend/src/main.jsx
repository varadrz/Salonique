// In src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

// --- ADD THESE IMPORTS FOR THE DATE PICKER ---
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// ------------------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the entire app in LocalizationProvider */}
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <CssBaseline />
        <App />
      </BrowserRouter>
    </LocalizationProvider>
  </React.StrictMode>
);