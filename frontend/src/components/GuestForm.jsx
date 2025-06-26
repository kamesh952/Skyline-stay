import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { formStyle } from '../styles';
export default function GuestForm({ guest, onSave, isEditing }) {
  const [formData, setFormData] = useState(guest || {
    name: '',
    email: '',
    phone: '',
    address: ''
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
          name: '',
          email: '',
          phone: '',
          address: ''
        });
      }
    } catch (error) {
      console.error('Error saving guest:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={formStyle}>
      <TextField
        fullWidth
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {isEditing ? 'Update Guest' : 'Add Guest'}
      </Button>
    </Box>
  );
}