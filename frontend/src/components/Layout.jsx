// src/components/Layout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  IconButton, 
  useMediaQuery, 
  useTheme, 
  Box
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import AppBar from './AppBar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Box component="main" sx={{ 
        flexGrow: 1,
        p: 3,
        marginTop: '64px'
      }}>
        <AppBar open={!isMobile && mobileOpen}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </AppBar>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;