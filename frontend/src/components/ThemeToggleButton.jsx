// In src/components/ThemeToggleButton.jsx

import React from 'react';
import { Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon

const ThemeToggleButton = ({ mode, toggleColorMode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        p: 1,
      }}
    >
      <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
};

export default ThemeToggleButton;