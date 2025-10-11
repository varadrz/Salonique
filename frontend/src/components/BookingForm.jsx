// In frontend/src/components/BookingForm.jsx

import React, { useState } from 'react';
import api from '../api/axios';
import { TextField, Button, Box, Stack, Typography, CircularProgress } from '@mui/material';

const BookingForm = ({ salonId, slot, onClose, onBookingSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      setError('Name and phone number are required.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const bookingData = {
        salon: salonId,
        customer_name: name,
        customer_phone: phone,
        start_time: slot.start_time,
      };

      const response = await api.post(
          '/api/appointments/',
          bookingData,
          { timeout: 15000 } // <-- ADDED: 15-second timeout
      );
      
      setIsSuccess(true);
      
      setTimeout(() => {
        onBookingSuccess(response.data);
      }, 1000);

    } catch (err) {
      console.error('Booking failed:', err);
      setError('Could not book appointment. The server may be busy. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      {isSuccess ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h5" color="success.main">✅ Success!</Typography>
          <Typography>Redirecting to confirmation...</Typography>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h6">Enter Your Details</Typography>
            
            <TextField
              required
              id="name"
              label="Full Name"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              required
              id="phone"
              label="Phone Number"
              type="tel"
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Box>
  );
};

export default BookingForm;