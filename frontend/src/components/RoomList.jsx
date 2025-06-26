import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Chip
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

export default function RoomList({ rooms, onDelete, onEdit }) {
  return (
    <Paper elevation={3} sx={{ mt: 3 }}>
      <List>
        {rooms.map((room) => (
          <ListItem key={room.id}>
            <ListItemText
              primary={`Room #${room.room_number} - ${room.type}`}
              secondary={
                <>
                  <div>Price: ${room.price} per night</div>
                  <div>Capacity: {room.capacity} guests</div>
                  <div>{room.description}</div>
                </>
              }
            />
            <ListItemSecondaryAction>
              <Chip 
                label={`$${room.price}`} 
                color="primary" 
                variant="outlined"
                sx={{ mr: 2 }}
              />
              <IconButton edge="end" onClick={() => onEdit(room)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" onClick={() => onDelete(room.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}