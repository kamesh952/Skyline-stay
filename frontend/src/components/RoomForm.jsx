import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import axios from 'axios';
import {formStyle} from '../styles';


const roomTypes = ['Single', 'Double', 'Suite', 'Deluxe'];

export default function RoomForm({ room, onSave, isEditing }) {
  const [formData, setFormData] = useState(room || {
    room_number: '',
    type: 'Single',
    price: '',
    capacity: 1,
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      if (!isEditing) {
        setFormData({
          room_number: '',
          type: 'Single',
          price: '',
          capacity: 1,
          description: ''
        });
      }
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
      <TextField
        fullWidth
        label="Room Number"
        name="room_number"
        value={formData.room_number}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        select
        fullWidth
        label="Room Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
        margin="normal"
      >
        {roomTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        label="Price per Night"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
        margin="normal"
        InputProps={{ inputProps: { min: 0 } }}
      />
      <TextField
        fullWidth
        label="Capacity"
        name="capacity"
        type="number"
        value={formData.capacity}
        onChange={handleChange}
        required
        margin="normal"
        InputProps={{ inputProps: { min: 1 } }}
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {isEditing ? 'Update Room' : 'Add Room'}
      </Button>
    </Box>
  );
}