import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      textAlign: 'center',
      p: 3
    }}>
      <Typography variant="h3" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You don't have permission to access this page.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
      >
        Go to Home
      </Button>
    </Box>
  );
}