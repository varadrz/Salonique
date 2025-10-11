// In src/components/HourlyHeatmap.jsx

import React, { useState } from 'react';
import { Box, Typography, Chip, Collapse } from '@mui/material';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const HourlyHeatmap = ({ availability, onSlotSelect }) => {
  const [expandedHour, setExpandedHour] = useState(null);

  const getColor = (busyness) => {
    if (busyness < 30) return 'success';
    if (busyness < 70) return 'warning';
    return 'error';
  };

  const handleHourClick = (hour, availableSlots) => {
    if (availableSlots.length > 0) {
      setExpandedHour(expandedHour === hour ? null : hour);
    }
  };

  // Get and sort the hours from the availability data
  const hours = Object.keys(availability).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        <AccessTimeIcon sx={{ mr: 1, color: 'secondary.main' }} />
        Select a Time Slot
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Hours are color-coded by busyness. Tap to see available 15-min slots.
      </Typography>

      {hours.map((hourKey) => {
        const hour = parseInt(hourKey);
        const data = availability[hourKey];
        const isExpanded = expandedHour === hour;
        // The filter now simply checks the boolean from the backend
        const availableSlots = data.slots?.filter(slot => slot.is_available) || [];
        
        // --- 12-HOUR FORMAT FIX ---
        const startTime = new Date(data.slots[0].start_time);
        const nextHour = new Date(startTime);
        nextHour.setHours(startTime.getHours() + 1);
        const hourLabel = `${startTime.toLocaleTimeString([], { hour: 'numeric', hour12: true })} - ${nextHour.toLocaleTimeString([], { hour: 'numeric', hour12: true })}`;
        
        return (
          <motion.div
            key={hour}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (hour - 9) * 0.05 }} // Adjust delay based on start hour
          >
            <Chip
              label={hourLabel}
              color={getColor(data.busy)}
              variant={availableSlots.length === 0 ? "outlined" : "filled"}
              onClick={() => handleHourClick(hour, availableSlots)}
              disabled={availableSlots.length === 0}
              sx={{
                mb: 1,
                mr: 1,
                cursor: availableSlots.length > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 500,
                '&:hover': { transform: 'scale(1.05)' },
              }}
            />
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 4, pb: 2, pt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {data.slots.map((slot) => (
                  <Chip
                    key={slot.start_time}
                    // --- 12-HOUR FORMAT FIX ---
                    label={new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    color="primary"
                    variant="outlined"
                    disabled={!slot.is_available}
                    onClick={() => onSlotSelect({ time: new Date(slot.start_time).toTimeString().slice(0,5) })}
                    sx={{ cursor: slot.is_available ? 'pointer' : 'not-allowed' }}
                  />
                ))}
              </Box>
            </Collapse>
          </motion.div>
        );
      })}
    </Box>
  );
};

export default HourlyHeatmap;