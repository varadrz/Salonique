// In src/components/admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ salons: 0, appointments: 0, schedules: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/stats/');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setStats({ salons: 0, appointments: 0, schedules: 0 }); // Fallback on error
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    // The outer Box now takes up the full height and width available to it.
    <Box sx={{ height: '100%', width: '100%' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Dashboard Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" color="primary.main">Total Salons</Typography>
                <Typography variant="h2" sx={{ fontWeight: 300 }}>{stats.salons}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" color="secondary.main">Today's Appointments</Typography>
                <Typography variant="h2" sx={{ fontWeight: 300 }}>{stats.appointments}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" color="warning.main">Active Schedules</Typography>
                <Typography variant="h2" sx={{ fontWeight: 300 }}>{stats.schedules}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Typography variant="body1" sx={{ mt: 4, color: 'text.secondary' }}>
          Use the sidebar to manage your salons and daily schedules.
        </Typography>
      </motion.div>
    </Box>
  );
};

export default AdminDashboard;