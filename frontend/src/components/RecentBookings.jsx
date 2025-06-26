import React, { useEffect, useState } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  Avatar,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import { cardStyle } from '../styles';
import {
  Event as EventIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function RecentBookings() {
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        // Sort by most recent check-in date and take first 5
        const sortedBookings = response.data
          .sort((a, b) => new Date(b.check_in) - new Date(a.check_in))
          .slice(0, 5);
        
        setRecentBookings(sortedBookings);
      } catch (err) {
        setError(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBookings();
  }, []);

  if (loading) {
    return (
      <Paper sx={cardStyle}>
        <Typography variant="h6" gutterBottom>
          Recent Bookings
        </Typography>
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={cardStyle}>
        <Typography variant="h6" gutterBottom>
          Recent Bookings
        </Typography>
        <Typography color="error" align="center" p={2}>
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={cardStyle}>
      <Typography variant="h6" gutterBottom>
        Recent Bookings
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Guest</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Dates</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentBookings.map((booking) => (
              <TableRow key={booking._id || booking.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {booking.guest?.name?.charAt(0) || 'G'}
                    </Avatar>
                    {booking.guest?.name || 'Guest'}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <HotelIcon fontSize="small" />
                    {booking.room?.number || 'N/A'} ({booking.room?.type || 'Unknown'})
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EventIcon fontSize="small" />
                    {new Date(booking.check_in).toLocaleDateString()} to {new Date(booking.check_out).toLocaleDateString()}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip 
                    label={booking.status || 'pending'}
                    color={booking.status === 'confirmed' ? 'success' : 'error'}
                    size="small"
                    icon={booking.status === 'confirmed' ? 
                      <CheckCircleIcon fontSize="small" /> : 
                      <CancelIcon fontSize="small" />}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}