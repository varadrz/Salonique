// In src/components/HeaderBar.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const HeaderBar = ({ mode, toggleColorMode }) => {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Salonique
        </Typography>
        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;