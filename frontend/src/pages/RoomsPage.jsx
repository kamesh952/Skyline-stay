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
import RoomForm from '../components/RoomForm';
import RoomList from '../components/RoomList';
import axios from 'axios';
import { paperStyle, pageStyle } from '../styles';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
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
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(prev => ({...prev, fetch: true}));
    setError(null);
    try {
      const response = await axios.get('https://hotel-databae-managment.onrender.com/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('Failed to fetch rooms. Please try again.');
    } finally {
      setLoading(prev => ({...prev, fetch: false}));
    }
  };

  const handleSave = async (roomData) => {
    setLoading(prev => ({...prev, save: true}));
    setError(null);
    try {
      if (editingRoom) {
        await axios.put(`https://hotel-databae-managment.onrender.com/api/rooms/${editingRoom._id}`, roomData);
        setSuccessMessage('Room updated successfully!');
        setEditingRoom(null);
      } else {
        await axios.post('https://hotel-databae-managment.onrender.com/api/rooms', roomData);
        setSuccessMessage('Room added successfully!');
      }
      await fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      setError(error.response?.data?.message || 'Failed to save room. Please try again.');
    } finally {
      setLoading(prev => ({...prev, save: false}));
    }
  };

  const handleDelete = async (roomId) => {
    if (!roomId) {
      setError('Invalid room ID');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    
    setLoading(prev => ({...prev, delete: true}));
    setError(null);
    try {
      await axios.delete(`https://hotel-databae-managment.onrender.com/api/rooms/${roomId}`);
      setSuccessMessage('Room deleted successfully!');
      await fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      setError(error.response?.data?.message || 'Failed to delete room. Please try again.');
    } finally {
      setLoading(prev => ({...prev, delete: false}));
    }
  };

  const handleEdit = (room) => {
    if (!room?._id) {
      setError('Invalid room data for editing');
      return;
    }
    setEditingRoom(room);
    if (isMobile) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingRoom(null);
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
          {editingRoom ? 'Edit Room' : 'Add New Room'}
        </Typography>
        {loading.save && <CircularProgress size={24} sx={{ margin: 2 }} />}
        <RoomForm
          room={editingRoom}
          onSave={handleSave}
          onCancel={editingRoom ? handleCancelEdit : null}
          isEditing={!!editingRoom}
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
          <RoomList
            rooms={rooms}
            onDelete={handleDelete}
            onEdit={handleEdit}
            loading={loading.delete}
          />
        )}
      </Box>
    </Box>
  );
}
