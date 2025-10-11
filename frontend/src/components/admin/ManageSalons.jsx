// src/components/admin/ManageSalons.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';

const ManageSalons = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSalon, setEditingSalon] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '', latitude: '', longitude: '', opening_time: '09:00', closing_time: '21:00' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/salons/');
      setSalons(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load salons.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.latitude || !formData.longitude) {
      setError('All fields are required.');
      return;
    }
    setError('');

    try {
      if (editingSalon) {
        await api.put(`/api/salons/${editingSalon.id}/`, formData);
      } else {
        await api.post('/api/salons/', formData);
      }
      fetchSalons();
      setOpenDialog(false);
    } catch (err) {
      setError('Save failed. Check your inputs.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this salon? This cannot be undone.')) {
      try {
        await api.delete(`/api/salons/${id}/`);
        fetchSalons();
      } catch (err) {
        setError('Delete failed.');
        console.error(err);
      }
    }
  };

  const handleEdit = (salon) => {
    setEditingSalon(salon);
    setFormData(salon);
    setOpenDialog(true);
  };

  const handleAddNew = () => {
    setEditingSalon(null);
    setFormData({ name: '', address: '', latitude: '', longitude: '', opening_time: '09:00', closing_time: '21:00' });
    setOpenDialog(true);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'latitude', headerName: 'Latitude', width: 100 },
    { field: 'longitude', headerName: 'Longitude', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // --- THE FIX IS HERE: The missing 'return' statement has been added ---
  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexShrink: 0 }}>
          <Typography variant="h4">Manage Salons</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew}>
            Add New Salon
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ flexGrow: 1, height: '100%' }}>
          <DataGrid
            rows={salons}
            columns={columns}
            loading={loading}
            slots={{ toolbar: GridToolbar }}
            sx={{ borderRadius: 4 }}
          />
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingSalon ? 'Edit Salon' : 'Add New Salon'}</DialogTitle>
          <DialogContent sx={{ pt: '20px !important' }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField fullWidth label="Salon Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Latitude" type="number" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Longitude" type="number" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} required sx={{ mb: 2 }} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default ManageSalons;