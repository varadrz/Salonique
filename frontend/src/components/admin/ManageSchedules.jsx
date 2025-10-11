// src/components/admin/ManageSchedules.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, IconButton, Alert } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({ salon: '', date: format(new Date(), 'yyyy-MM-dd'), num_workers: 1 });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schedulesRes, salonsRes] = await Promise.all([
        api.get('/api/dailyschedule/'),
        api.get('/api/salons/'),
      ]);
      setSchedules(schedulesRes.data);
      setSalons(salonsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.salon || !formData.date || formData.num_workers < 1) {
      setError('All fields are required.');
      return;
    }
    setError('');

    try {
      if (editingSchedule) {
        await api.put(`/api/dailyschedule/${editingSchedule.id}/`, formData);
      } else {
        await api.post('/api/dailyschedule/', formData);
      }
      fetchData();
      setOpenDialog(false);
    } catch (err) {
      setError('Save failed. This date may already be scheduled for this salon.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this schedule? This will affect booking availability.')) {
      try {
        await api.delete(`/api/dailyschedule/${id}/`);
        fetchData();
      } catch (err) {
        setError('Delete failed.');
        console.error(err);
      }
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      salon: schedule.salon,
      date: schedule.date,
      num_workers: schedule.num_workers,
    });
    setOpenDialog(true);
  };
  
  const handleAddNew = () => {
    setEditingSchedule(null);
    setFormData({ salon: '', date: format(new Date(), 'yyyy-MM-dd'), num_workers: 1 });
    setOpenDialog(true);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'salon',
      headerName: 'Salon',
      width: 200,
      valueGetter: (value) => salons.find(s => s.id === value)?.name || 'Unknown',
    },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'num_workers', headerName: 'Workers', width: 120, type: 'number' },
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

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexShrink: 0 }}>
          <Typography variant="h4">Manage Daily Schedules</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew}>
            Add New Schedule
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ flexGrow: 1, height: '100%' }}>
          <DataGrid
            rows={schedules}
            columns={columns}
            loading={loading}
            slots={{ toolbar: GridToolbar }}
            sx={{ borderRadius: 4, height: '100%' }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
          <DialogContent sx={{ pt: '20px !important' }}>
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel>Select Salon</InputLabel>
              <Select
                value={formData.salon}
                label="Select Salon"
                onChange={(e) => setFormData({ ...formData, salon: e.target.value })}
              >
                {salons.map((salon) => (
                  <MenuItem key={salon.id} value={salon.id}>
                    {salon.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Number of Workers"
              type="number"
              value={formData.num_workers}
              onChange={(e) => setFormData({ ...formData, num_workers: parseInt(e.target.value) || 1 })}
              required
              inputProps={{ min: 1, max: 20 }}
              sx={{ mb: 2 }}
              helperText="This controls the booking capacity for the day."
            />
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

export default ManageSchedules;