import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  MenuItem, 
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { formStyle } from '../styles';

export default function BookingForm({ booking, onSave, isEditing }) {
  const [formData, setFormData] = useState({
    guest_id: '',
    room_id: '',
    check_in: new Date(),
    check_out: new Date(),
    special_requests: '',
    ...booking // Spread existing booking data if editing
  });

  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const guestsRes = await axios.get('http://localhost:5000/api/guests');
        const roomsRes = await axios.get('http://localhost:5000/api/rooms');
        setGuests(guestsRes.data);
        setRooms(roomsRes.data);
        
        // If editing, ensure IDs are strings (MUI Select requires string values)
        if (booking) {
          setFormData(prev => ({
            ...prev,
            guest_id: String(booking.guest_id),
            room_id: String(booking.room_id)
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.guest_id) newErrors.guest_id = 'Guest is required';
    if (!formData.room_id) newErrors.room_id = 'Room is required';
    if (!formData.check_in) newErrors.check_in = 'Check-in date is required';
    if (!formData.check_out) newErrors.check_out = 'Check-out date is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Format dates as strings for the API
      const dataToSend = {
        ...formData,
        check_in: formData.check_in.toISOString().split('T')[0],
        check_out: formData.check_out.toISOString().split('T')[0]
      };
      
      await onSave(dataToSend);
      
      if (!isEditing) {
        // Reset form after successful submission (for new bookings)
        setFormData({
          guest_id: '',
          room_id: '',
          check_in: new Date(),
          check_out: new Date(),
          special_requests: ''
        });
      }
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
        <FormControl fullWidth margin="normal" error={!!errors.guest_id}>
          <InputLabel id="guest-label">Guest</InputLabel>
          <Select
            labelId="guest-label"
            id="guest_id"
            name="guest_id"
            value={formData.guest_id}
            onChange={handleChange}
            label="Guest"
            disabled={loading}
          >
            {guests.map((guest) => (
              <MenuItem key={guest._id || guest.id} value={String(guest._id || guest.id)}>
                {guest.name} ({guest.email})
              </MenuItem>
            ))}
          </Select>
          {errors.guest_id && <FormHelperText>{errors.guest_id}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.room_id}>
          <InputLabel id="room-label">Room</InputLabel>
          <Select
            labelId="room-label"
            id="room_id"
            name="room_id"
            value={formData.room_id}
            onChange={handleChange}
            label="Room"
            disabled={loading}
          >
            {rooms.map((room) => (
              <MenuItem key={room._id || room.id} value={String(room._id || room.id)}>
                {room.room_number} ({room.type}) - ${room.price}/night
              </MenuItem>
            ))}
          </Select>
          {errors.room_id && <FormHelperText>{errors.room_id}</FormHelperText>}
        </FormControl>

        <DatePicker
          label="Check-in Date"
          value={formData.check_in}
          onChange={(date) => handleDateChange('check_in', date)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              fullWidth 
              margin="normal" 
              required 
              error={!!errors.check_in}
              helperText={errors.check_in}
            />
          )}
          disabled={loading}
        />

        <DatePicker
          label="Check-out Date"
          value={formData.check_out}
          onChange={(date) => handleDateChange('check_out', date)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              fullWidth 
              margin="normal" 
              required 
              error={!!errors.check_out}
              helperText={errors.check_out}
            />
          )}
          minDate={formData.check_in}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Special Requests"
          name="special_requests"
          value={formData.special_requests}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
          disabled={loading}
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Processing...' : isEditing ? 'Update Booking' : 'Create Booking'}
        </Button>
      </Box>
    </LocalizationProvider>
  );
}