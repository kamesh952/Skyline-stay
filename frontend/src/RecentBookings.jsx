import React from 'react';
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
  Box
} from '@mui/material';
import { cardStyle } from '../styles';
import {
  Event as EventIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

export default function RecentBookings() {
  // Sample data - replace with real API data
  const recentBookings = [
    {
      id: '1',
      guest: { name: 'John Doe', avatar: 'JD' },
      room: { number: '101', type: 'Deluxe' },
      checkIn: '2023-06-15',
      checkOut: '2023-06-20',
      status: 'confirmed'
    },
    {
      id: '2',
      guest: { name: 'Jane Smith', avatar: 'JS' },
      room: { number: '205', type: 'Suite' },
      checkIn: '2023-06-16',
      checkOut: '2023-06-18',
      status: 'confirmed'
    },
    // Add more sample bookings as needed
  ];

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
              <TableRow key={booking.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {booking.guest.avatar}
                    </Avatar>
                    {booking.guest.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <HotelIcon fontSize="small" />
                    {booking.room.number} ({booking.room.type})
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EventIcon fontSize="small" />
                    {booking.checkIn} to {booking.checkOut}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip 
                    label={booking.status}
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