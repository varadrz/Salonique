// In src/App.jsx

import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';

import { lightTheme, darkTheme } from './theme';
// HeaderBar is no longer imported or used here
import MainPage from './components/MainPage';
import BookingPage from './components/BookingPage';
import ConfirmationPage from './components/ConfirmationPage';

// Admin component imports
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageSalons from './components/admin/ManageSalons';
import ManageSchedules from './components/admin/ManageSchedules';

function App() {
  const [mode, setMode] = useState('dark');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  // We pass the theme mode and toggle function down to each page
  const pageProps = { mode, toggleColorMode };

  return (
    <ThemeProvider theme={theme}>
      {/* The outer Box no longer controls layout, only background color */}
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Routes>
          {/* Each route now renders a self-contained, full-page component */}
          <Route path="/" element={<MainPage {...pageProps} />} />
          <Route path="/book" element={<BookingPage {...pageProps} />} />
          <Route path="/confirmation" element={<ConfirmationPage {...pageProps} />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin {...pageProps} />} />
          <Route path="/admin" element={<AdminLayout {...pageProps} />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="salons" element={<ManageSalons />} />
              <Route path="schedules" element={<ManageSchedules />} />
          </Route>
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;