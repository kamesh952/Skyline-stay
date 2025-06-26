import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  styled,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StyledAppBar = styled(AppBar)(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 240, // drawerWidth
    width: "calc(100% - 240px)",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const GrowDiv = styled("div")({
  flexGrow: 1,
});

export default function CustomAppBar({ children, open }) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };
  const users = {
    name: "Alice Johnson",
    avatarUrl: "user_icon.png", // random avatar service
  };

  return (
    <StyledAppBar position="fixed" open={open}>
      <Toolbar>
        {children}
        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{ fontWeight: 600 }}
        >
          Skyline Stays
        </Typography>
        <GrowDiv />
        <IconButton color="inherit" size="large">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit" size="large" onClick={handleDashboardClick}>
          <SettingsIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          <Typography variant="subtitle1" sx={{ mr: 1 }}>
            {user?.name}
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar
              src={'user_icon.png'} // This should be a valid image URL
              alt={user?.name}
              sx={{ width: 32, height: 32 }}
            >
              {user?.name?.split(" ")[0]?.charAt(0)}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleDashboardClick}>Dashboard</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
