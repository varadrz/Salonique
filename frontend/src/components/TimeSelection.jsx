// In src/components/TimeSelection.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import HourlyHeatmap from './HourlyHeatmap';
import api from '../api/axios';

// This function transforms the API data into the format the heatmap needs
const processSlotsForHeatmap = (slots) => {
  const hourlyData = {};
  if (!Array.isArray(slots)) return hourlyData; // Safety check

  slots.forEach(slot => {
    const dateObj = new Date(slot.start_time);
    const hour = dateObj.getHours();
    const hourKey = `${String(hour).padStart(2, '0')}:00`;

    if (!hourlyData[hourKey]) {
      hourlyData[hourKey] = { busy: 0, slots: [], totalCapacity: 0, totalBooked: 0 };
    }
    // Push the ENTIRE slot object for the heatmap to use
    hourlyData[hourKey].slots.push(slot); 
    hourlyData[hourKey].totalCapacity += slot.capacity;
    hourlyData[hourKey].totalBooked += slot.booked;
  });

  // Calculate busyness percentage for each hour
  for (const hourKey in hourlyData) {
    const hour = hourlyData[hourKey];
    hour.busy = hour.totalCapacity > 0 ? (hour.totalBooked / hour.totalCapacity) * 100 : 100;
  }
  return hourlyData;
};

const TimeSelection = ({ salon, date, onSlotSelect, onBack }) => {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(
        `/api/salons/${salon.id}/availability/?date=${format(date, 'yyyy-MM-dd')}`
      );
      const processedData = processSlotsForHeatmap(response.data);
      setAvailability(processedData);
    } catch (err) {
      setError('Could not fetch availability. Please try another date.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [salon.id, date]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  if (loading) {
    return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <CircularProgress sx={{ my: 4 }} />
          <Typography>Loading time slots...</Typography>
        </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', p: 2 }}>
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
              <Typography variant="h5" gutterBottom>
                {salon.name} - {format(date, 'MMM dd, yyyy')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a time based on real-time availability.
              </Typography>
          </Box>
          <Button onClick={onBack} variant="outlined">Back to Map</Button>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </motion.div>

      <Box sx={{ flex: 1, pt: 2 }}>
        {Object.keys(availability).length > 0 ? (
            <HourlyHeatmap
              availability={availability}
              onSlotSelect={onSlotSelect}
            />
        ) : (
            <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                No slots available for this day.
            </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TimeSelection;