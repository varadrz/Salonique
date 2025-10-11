// In src/components/admin/AdminLayout.jsx

import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ScheduleIcon from '@mui/icons-material/Schedule';

const AdminLayout = () => {
  const theme = useTheme();
  
  const activeLinkStyle = {
    backgroundColor: theme.palette.action.selected,
    borderRight: `3px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
    }
  };

  return (
    // This Box creates the overall flex container for the admin section
    <Box sx={{ display: 'flex', flexGrow: 1, height: '100%' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: 240,
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider'
        }}
      >
        <List>
          <ListItem disablePadding component={NavLink} to="/admin/dashboard" sx={{ textDecoration: 'none', color: 'inherit' }} style={({ isActive }) => isActive ? activeLinkStyle : {}}>
            <ListItemButton>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding component={NavLink} to="/admin/salons" sx={{ textDecoration: 'none', color: 'inherit' }} style={({ isActive }) => isActive ? activeLinkStyle : {}}>
            <ListItemButton>
              <ListItemIcon><StorefrontIcon /></ListItemIcon>
              <ListItemText primary="Manage Salons" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding component={NavLink} to="/admin/schedules" sx={{ textDecoration: 'none', color: 'inherit' }} style={({ isActive }) => isActive ? activeLinkStyle : {}}>
            <ListItemButton>
              <ListItemIcon><ScheduleIcon /></ListItemIcon>
              <ListItemText primary="Manage Schedules" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        {/* The child page (e.g., AdminDashboard) will be rendered here */}
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default AdminLayout;