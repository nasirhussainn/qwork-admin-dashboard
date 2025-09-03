// src/components/Sidebar.js
import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import { Home, People, Collections } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const navItems = [
  { text: 'Home', icon: <Home />, path: '/' },
  { text: 'Accounts', icon: <People />, path: '/accounts' },
  { text: 'Portfolios', icon: <Collections />, path: '/portfolios' },
];

const Sidebar = () => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar header */}
      <Box sx={{ px: 2, py: 3 }}>
        <Typography variant="h6" color="white" fontWeight="bold">
          Admin Dashboard
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 1 }} />

      {/* Navigation */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                px: 3,
                py: 1.5,
                color: 'rgba(255, 255, 255, 0.7)',
                borderLeft: '3px solid transparent',
                transition: 'all 0.2s ease',
                '&.active': {
                  borderLeft: '3px solid #1976d2', // Primary color highlight
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 'bold',
                  '& .MuiListItemIcon-root': {
                    color: '#1976d2',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: 15 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ px: 2, py: 2, mt: 'auto' }}>
        <Typography variant="caption" color="rgba(255,255,255,0.5)">
          © {new Date().getFullYear()} Q-Work
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
