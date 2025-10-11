// src/components/BookingPage.jsx (continued/completed)
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Card, CardContent, CircularProgress, Alert, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import api from '../api/axios';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { salon, slot, phone: prefillPhone, date } = location.state || {}; // From nav state

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: prefillPhone || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(''); // Clear on input
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setError('Full name is required.');
      return false;
    }
    if (!/^\d{10}$/.test(formData.customerPhone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Format start_time as datetime string (e.g., '2023-10-15T14:30:00')
      const startTime = `${format(date, 'yyyy-MM-dd')}T${slot.time}:00`;
      const response = await api.post('/api/appointments/', {
        salon: salon.id,
        customer_name: formData.customerName.trim(),
        customer_phone: formData.customerPhone.replace(/\D/g, ''),
        start_time: startTime,
      });

      // Success: Navigate with booking details
      navigate('/confirmation', {
        state: {
          bookingDetails: response.data, // Assume { id, ... } from API
          salon,
          date,
          slot,
          customerName: formData.customerName,
        },
      });
    } catch (err) {
      setError('Booking failed. Please try again or contact support.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // If no state (e.g., direct access), redirect to home
  if (!salon || !slot || !date) {
    navigate('/');
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', bgcolor: 'background.default' }}>
      {/* Header: Booking Summary Card */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ mx: 2, mt: 2, mb: 2, borderRadius: 3, boxShadow: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
              Confirm Your Booking
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" fontWeight="bold">Salon:</Typography>
              <Typography variant="body1">{salon.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" fontWeight="bold">Date:</Typography>
              <Typography variant="body1">{format(date, 'MMM dd, yyyy')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" fontWeight="bold">Time:</Typography>
              <Typography variant="body1">{slot.time}</Typography>
            </Box>
            {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 8 }}>{error}</Alert>}
          </CardContent>
        </Card>
      </motion.div>

      {/* Form: Full remaining space, centered */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 3, boxShadow: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                Enter Your Details
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="customerName"
                  variant="outlined"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                  inputProps={{ 'aria-label': 'Full name for booking' }}
                />
                <TextField
                  fullWidth
                  label="Phone Number (10 digits)"
                  name="customerPhone"
                  variant="outlined"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  error={!!error && !/^\d{10}$/.test(formData.customerPhone.replace(/\D/g, ''))}
                  helperText={error || 'Used for confirmations'}
                  sx={{ mb: 3 }}
                  inputProps={{ 'aria-label': 'Phone number for booking' }}
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.5, borderRadius: 12 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};

export default BookingPage;