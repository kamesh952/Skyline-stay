import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Chip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { format } from "date-fns";

export default function BookingList({ bookings, onDelete, onEdit }) {
  return (
    <Paper elevation={3} sx={{ mt: 3 }}>
      <List>
        {bookings.map((booking) => (
          <ListItem key={booking.id}>
            <ListItemText
              primary={`Booking #${booking.id}`}
              secondary={
                <>
                  <div>Guest: {booking.guest?.name}</div>
                  <div>
                    Room: #{booking.room?.room_number} ({booking.room?.type})
                  </div>
                  <div>
                    Dates: {format(new Date(booking.check_in), "MMM dd, yyyy")}{" "}
                    -{format(new Date(booking.check_out), "MMM dd, yyyy")}
                  </div>
                  <div>
                    Special Requests: {booking.special_requests || "None"}
                  </div>
                </>
              }
            />
            <ListItemSecondaryAction>
              <Chip
                label={`${format(new Date(booking.check_in), "MMM dd")}`}
                color="primary"
                variant="outlined"
                sx={{ mr: 2 }}
              />

              <IconButton edge="end" onClick={() => onEdit(booking)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" onClick={() => onDelete(booking.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
