import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

export default function GuestList({ guests, onDelete, onEdit }) {
  return (
    <Paper elevation={3} sx={{ mt: 3 }}>
      <List>
        {guests.map((guest) => (
          <ListItem key={guest.id}>
            <ListItemText
              primary={guest.name}
              secondary={
                <>
                  <div>Email: {guest.email}</div>
                  <div>Phone: {guest.phone}</div>
                  <div>Address: {guest.address}</div>
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onEdit(guest)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" onClick={() => onDelete(guest.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}