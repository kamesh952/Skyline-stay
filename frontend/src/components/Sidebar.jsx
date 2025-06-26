import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Hotel as HotelIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: 'none',
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '8px',
  margin: '4px 16px',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function Sidebar({ mobileOpen, onDrawerToggle }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    // Close mobile drawer when item is selected
    if (isMobile && onDrawerToggle) {
      onDrawerToggle();
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
    { text: 'Guests', icon: <PeopleIcon />, path: '/guests' },
    { text: 'Rooms', icon: <HotelIcon />, path: '/rooms' },
    { text: 'Bookings', icon: <CalendarIcon />, path: '/bookings' },
  ];

  const drawerContent = (
    <>
      {isMobile && <DrawerHeader />}
      <List>
        {menuItems.map((item, index) => (
          <Link
            to={item.path}
            key={item.text}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <StyledListItem
              button
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItem>
          </Link>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Desktop Drawer - Always visible */}
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
        }}
      >
        {drawerContent}
      </StyledDrawer>

      {/* Mobile Drawer - Temporary/Collapsible */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}