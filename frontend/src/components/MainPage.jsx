// src/components/MainPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// --- THIS IS THE FIX: 'Snackbar' has been added to the import list ---
import { Box, Typography, TextField, Button, CircularProgress, Alert, Snackbar, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Phone as PhoneIcon } from '@mui/icons-material';
import HeaderBar from './HeaderBar';
import MapDashboard from './MapDashboard';
import SalonDetail from './SalonDetail';
import TimeSelection from './TimeSelection';
import api from '../api/axios'; // Your axios instance

// Accept mode and toggleColorMode as props
const MainPage = ({ mode, toggleColorMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Step 1 complete
  const [selectedSalon, setSelectedSalon] = useState(null); // Step 2 complete
  const [selectedDate, setSelectedDate] = useState(null); // Step 3 complete
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Validate & "login" (no API, just state change)
  const handlePhoneSubmit = async () => {
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate brief "verification" (optional API if you add one)
    setTimeout(() => {
      setIsLoggedIn(true);
      setLoading(false);
    }, 1000);
  };

  // Step 2: Salon selected
  const handleSalonSelect = (salon) => {
    setSelectedSalon(salon);
    setSelectedDate(new Date()); // Auto-set date to move forward
  };

  // Step 3: Date selected
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Step 4: Slot selected → Navigate to /book
  const handleSlotSelect = (slot) => {
    navigate('/book', { 
      state: { 
        salon: selectedSalon, 
        slot, 
        phone, // Pass for pre-fill
        date: selectedDate 
      } 
    });
  };

  // Close snackbar
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <HeaderBar mode={mode} toggleColorMode={toggleColorMode} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!isLoggedIn ? (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
                <PhoneIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                  Welcome to Salonique
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                  Enter your phone number to find nearby salons and book instantly.
                </Typography>
                <TextField
                  fullWidth
                  label="Phone Number (10 digits)"
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  error={!!error}
                  helperText={error || 'e.g., 1234567890'}
                  sx={{ mb: 2 }}
                  inputProps={{ 'aria-label': 'Phone number input' }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handlePhoneSubmit}
                  disabled={loading || phone.length < 10}
                  sx={{ mt: 2, py: 1.5 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Find Salons'}
                </Button>
              </Box>
            </motion.div>
          </Box>
        ) : !selectedSalon ? (
          <MapDashboard onSelectSalon={handleSalonSelect} />
        ) : !selectedDate ? (
          <SalonDetail salon={selectedSalon} onDateSelect={handleDateSelect} onBack={() => setSelectedSalon(null)} />
        ) : (
          <TimeSelection salon={selectedSalon} date={selectedDate} onSlotSelect={handleSlotSelect} onBack={() => setSelectedDate(null)} />
        )}
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainPage;