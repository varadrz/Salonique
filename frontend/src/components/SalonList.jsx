// In src/components/SalonList.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

// Import MUI components
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress, // A loading spinner
  Box,            // A generic container
} from '@mui/material';

const SalonList = ({ onSelectSalon }) => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... (keep the same useEffect logic to fetch salons)
    const fetchSalons = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/salons/');
        setSalons(response.data);
      } catch (err) {
        setError('Failed to fetch salons. Is the backend server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, []);

  const containerVariants = { /* ... (keep your framer-motion variants) */ };
  const itemVariants = { /* ... (keep your framer-motion variants) */ };

  // Show a spinner while loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show an error message
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    // Use MUI Container to center and manage content width
    <Container maxWidth="sm">
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Choose a Salon
      </Typography>
      
      {/* Replace <ul> with MUI's List */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <List>
          {salons.map(salon => (
            // Replace <li> with MUI's ListItem components
            <motion.div key={salon.id} variants={itemVariants}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => onSelectSalon(salon)} sx={{ mb: 1, borderRadius: 1 }}>
                  <ListItemText
                    primary={salon.name}
                    secondary={salon.address}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </motion.div>
    </Container>
  );
};

export default SalonList;