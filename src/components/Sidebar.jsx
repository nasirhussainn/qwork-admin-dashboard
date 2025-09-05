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
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import { 
  Home, 
  People, 
  Collections, 
  AccountCircle,
  AdminPanelSettings 
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const navItems = [
  { text: 'Home', icon: <Home />, path: '/home' },
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

      {/* Admin Profile Section */}
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 2 }} />
        
        {/* Admin Profile Card */}
        <Box sx={{ px: 2, mb: 2 }}>
          <ListItemButton
            component={NavLink}
            to="/admin-profile"
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1.5,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.8)',
              transition: 'all 0.3s ease',
              '&.active': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                '& .admin-badge': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                },
                '& .MuiAvatar-root': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }
              },
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                }}
              >
                <AdminPanelSettings fontSize="small" />
              </Avatar>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack spacing={0.5}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      lineHeight: 1.2,
                    }}
                  >
                    My Profile
                  </Typography>
                  <Chip
                    label="Admin"
                    size="small"
                    className="admin-badge"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      alignSelf: 'flex-start',
                      '& .MuiChip-label': {
                        px: 1,
                      }
                    }}
                  />
                </Stack>
              </Box>
              
              <AccountCircle 
                sx={{ 
                  fontSize: 20, 
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                }} 
              />
            </Stack>
          </ListItemButton>
        </Box>

        {/* Footer */}
        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="caption" color="rgba(255,255,255,0.5)">
            © {new Date().getFullYear()} Q-Work
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;