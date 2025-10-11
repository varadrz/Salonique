// In src/components/admin/AdminLogin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import BusinessIcon from '@mui/icons-material/Business';
import api from '../../api/axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Username and password are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/auth/login/', formData);
      localStorage.setItem('adminToken', response.data.access);
      navigate('/admin/dashboard', { replace: true }); // Use replace to prevent going back to login
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // THE FIX IS HERE: Replaced 100vh/vw with flexbox to center in the available space.
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 4, boxShadow: 4, p: 2 }}>
          <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 4 } }}>
            <BusinessIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Salon Owner Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Access your dashboard to manage salons and schedules.
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                variant="outlined"
                value={formData.username}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                inputProps={{ 'aria-label': 'Admin username' }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                inputProps={{ 'aria-label': 'Admin password' }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.5, borderRadius: 3 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default AdminLogin;