import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  useMediaQuery, 
  useTheme,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';
import axios from 'axios';
import { paperStyle, pageStyle } from '../styles';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [loading, setLoading] = useState({
    fetch: false,
    save: false,
    delete: false
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(prev => ({...prev, fetch: true}));
    setError(null);
    try {
      const response = await axios.get('https://hotel-databae-managment.onrender.com/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(prev => ({...prev, fetch: false}));
    }
  };

  const handleSave = async (bookingData) => {
    setLoading(prev => ({...prev, save: true}));
    setError(null);
    try {
      if (editingBooking) {
        await axios.put(`https://hotel-databae-managment.onrender.com/api/bookings/${editingBooking._id}`, bookingData);
        setSuccessMessage('Booking updated successfully!');
        setEditingBooking(null);
      } else {
        await axios.post('http://localhost:5000/api/bookings', bookingData);
        setSuccessMessage('Booking created successfully!');
      }
      await fetchBookings();
    } catch (error) {
      console.error('Error saving booking:', error);
      setError(error.response?.data?.message || 'Failed to save booking. Please try again.');
    } finally {
      setLoading(prev => ({...prev, save: false}));
    }
  };

  const handleDeleteClick = (bookingId) => {
    setBookingToDelete(bookingId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;
    
    setLoading(prev => ({...prev, delete: true}));
    setError(null);
    try {
      await axios.delete(`https://hotel-databae-managment.onrender.com/api/bookings/${bookingToDelete}`);
      setSuccessMessage('Booking deleted successfully!');
      await fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError(error.response?.data?.message || 'Failed to delete booking. Please try again.');
    } finally {
      setLoading(prev => ({...prev, delete: false}));
      setDeleteConfirmOpen(false);
      setBookingToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setBookingToDelete(null);
  };

  const handleEdit = (booking) => {
    if (!booking?._id) {
      setError('Invalid booking data for editing');
      return;
    }
    setEditingBooking(booking);
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  return (
    <Box sx={{
      ...pageStyle,
      padding: isMobile ? 2 : 4,
      gap: isMobile ? 2 : 4,
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Notifications */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            autoFocus
            disabled={loading.delete}
          >
            {loading.delete ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Form Section */}
      <Paper elevation={3} sx={{
        ...paperStyle,
        width: isMobile ? '100%' : '600px',
        padding: isMobile ? 2 : 3,
        margin: '0 auto'
      }}>
        <Typography variant="h5" gutterBottom>
          {editingBooking ? 'Edit Booking' : 'Create New Booking'}
        </Typography>
        {loading.save && <CircularProgress size={24} sx={{ margin: 2 }} />}
        <BookingForm
          booking={editingBooking}
          onSave={handleSave}
          onCancel={editingBooking ? handleCancelEdit : null}
          isEditing={!!editingBooking}
          loading={loading.save}
        />
      </Paper>

      {/* List Section */}
      <Box sx={{ 
        width: '100%',
        marginTop: isMobile ? 2 : 4
      }}>
        {loading.fetch ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <BookingList
            bookings={bookings}
            onDelete={handleDeleteClick}
            onEdit={handleEdit}
            loading={loading.delete}
          />
        )}
      </Box>
    </Box>
  );
}
