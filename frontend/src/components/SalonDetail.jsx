// src/components/SalonDetail.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Card, CardContent, Typography, Button, Container, Alert, Skeleton, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import api from '../api/axios'; // If you want to fetch extra salon details (optional)

const SalonDetail = ({ salon, onDateSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Optional: Fetch extra details (e.g., salon bio) on mount
  useEffect(() => {
    setLoading(true);
    // Example: api.get(`/api/salons/${salon.id}/`).then(...) – add if your API has it
    setTimeout(() => setLoading(false), 500); // Simulate
  }, [salon.id]);

  const handleDateChange = (date) => {
    if (date && date >= new Date()) { // Prevent past dates
      setSelectedDate(date);
      onDateSelect(date); // Trigger next step
      setError('');
    } else {
      setError('Please select a future date.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 0 }} />
        <Box sx={{ flex: 1, p: 2 }}>
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2, borderRadius: 12 }} />
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 12 }} />
        </Box>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {/* Header: Salon Info Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ mx: 2, mt: 2, mb: 1, borderRadius: 16, boxShadow: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
                {salon.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="body1">{salon.address || 'Address not available'}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {salon.distance ? `${salon.distance.toFixed(2)} km away` : ''}
              </Typography>
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </CardContent>
          </Card>
        </motion.div>

        {/* Main: Date Picker */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ textAlign: 'center', maxWidth: 400, width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                <CalendarTodayIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'warning.main' }} />
                Select a Date
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose a date for your appointment (starting today).
              </Typography>
              <DatePicker
                value={selectedDate}
                minDate={new Date()} // No past dates
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    sx={{ borderRadius: 12 }}
                    inputProps={{ 'aria-label': 'Select appointment date' }}
                  />
                )}
                slotProps={{
                  textField: {
                    error: !!error,
                    helperText: error || 'Default: Today',
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleDateChange(selectedDate)}
                disabled={!selectedDate || selectedDate < new Date()}
                sx={{ mt: 3, py: 1.5 }}
              >
                Next: Choose Time
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default SalonDetail;