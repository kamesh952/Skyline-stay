import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  useMediaQuery, 
  useTheme,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import GuestForm from '../components/GuestForm';
import GuestList from '../components/GuestList';
import axios from 'axios';
import { paperStyle, pageStyle } from '../styles';

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [editingGuest, setEditingGuest] = useState(null);
  const [loading, setLoading] = useState({
    fetch: false,
    save: false,
    delete: false
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(prev => ({...prev, fetch: true}));
    setError(null);
    try {
      const response = await axios.get('https://hotel-databae-managment.onrender.com/api/guests');
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
      setError('Failed to fetch guests. Please try again.');
    } finally {
      setLoading(prev => ({...prev, fetch: false}));
    }
  };

  const handleSave = async (guestData) => {
    setLoading(prev => ({...prev, save: true}));
    setError(null);
    try {
      if (editingGuest) {
        await axios.put(`https://hotel-databae-managment.onrender.com/api/guests/${editingGuest._id}`, guestData);
        setSuccessMessage('Guest updated successfully!');
        setEditingGuest(null);
      } else {
        await axios.post('http://localhost:5000/api/guests', guestData);
        setSuccessMessage('Guest added successfully!');
      }
      await fetchGuests();
    } catch (error) {
      console.error('Error saving guest:', error);
      setError(error.response?.data?.message || 'Failed to save guest. Please try again.');
    } finally {
      setLoading(prev => ({...prev, save: false}));
    }
  };

  const handleDelete = async (guestId) => {
    if (!guestId) {
      setError('Invalid guest ID');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this guest?')) return;
    
    setLoading(prev => ({...prev, delete: true}));
    setError(null);
    try {
      await axios.delete(`https://hotel-databae-managment.onrender.com/api/guests/${guestId}`);
      setSuccessMessage('Guest deleted successfully!');
      await fetchGuests();
    } catch (error) {
      console.error('Error deleting guest:', error);
      setError(error.response?.data?.message || 'Failed to delete guest. Please try again.');
    } finally {
      setLoading(prev => ({...prev, delete: false}));
    }
  };

  const handleEdit = (guest) => {
    if (!guest?._id) {
      setError('Invalid guest data for editing');
      return;
    }
    setEditingGuest(guest);
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingGuest(null);
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

      {/* Form Section */}
      <Paper elevation={3} sx={{
        ...paperStyle,
        width: isMobile ? '100%' : '600px',
        padding: isMobile ? 2 : 3,
        margin: '0 auto'
      }}>
        <Typography variant="h5" gutterBottom>
          {editingGuest ? 'Edit Guest' : 'Add New Guest'}
        </Typography>
        {loading.save && <CircularProgress size={24} sx={{ margin: 2 }} />}
        <GuestForm
          guest={editingGuest}
          onSave={handleSave}
          onCancel={editingGuest ? handleCancelEdit : null}
          isEditing={!!editingGuest}
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
          <GuestList
            guests={guests}
            onDelete={handleDelete}
            onEdit={handleEdit}
            loading={loading.delete}
          />
        )}
      </Box>
    </Box>
  );
}
