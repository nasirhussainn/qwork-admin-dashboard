// src/layouts/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Stack,
  Chip,
  Paper,
  Fade,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Brightness4,
  Brightness7,
  Search,
  Settings,
  Logout,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import Sidebar from "../components/Sidebar";

const drawerWidth = 280;

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationCount] = useState(3); // This could come from props or state
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const isMobile = useMediaQuery("(max-width:768px)");
  const theme = useTheme();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 1000\"><polygon fill=\"%23ffffff\" fill-opacity=\"0.05\" points=\"0,1000 1000,0 1000,1000\"/></svg>')",
          pointerEvents: "none",
        }
      }}
    >
      <Toolbar sx={{ position: "relative", zIndex: 1, py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Paper
            sx={{
              p: 1.5,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
            }}
          >
            <DashboardIcon sx={{ color: "white", fontSize: 28 }} />
          </Paper>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Q-Work
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
              Admin Portal
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      
      <Divider 
        sx={{ 
          borderColor: "rgba(255,255,255,0.1)",
          mx: 2,
          my: 1,
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
        }} 
      />
      
      {/* User Info Section */}
      <Box sx={{ px: 2, py: 1.5, position: "relative", zIndex: 1 }}>
        <Paper
          sx={{
            p: 2,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "#10b981",
                    border: "2px solid white",
                  }}
                />
              }
            >
              <Avatar
                sx={{
                  width: 45,
                  height: 45,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontWeight: 700,
                }}
              >
                A
              </Avatar>
            </Badge>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "white" }}>
                Admin User
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: "rgba(255,255,255,0.7)",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                admin@qwork.com
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 1, position: "relative", zIndex: 1 }}>
        <Sidebar />
      </Box>

      {/* Footer with current time */}
      <Box sx={{ p: 2, position: "relative", zIndex: 1 }}>
        <Paper
          sx={{
            p: 1.5,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", display: "block" }}>
            {formatDate(currentTime)}
          </Typography>
          <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
            {formatTime(currentTime)}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Enhanced Top App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          color: "#1e293b",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Menu button on mobile */}
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2,
                  "&:hover": {
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Welcome back! Here's what's happening today.
              </Typography>
            </Box>
          </Box>

          {/* Right side actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Quick stats */}
            <Stack direction="row" spacing={2} sx={{ mr: 2, display: { xs: "none", sm: "flex" } }}>
              <Chip
                label="12 Active"
                size="small"
                sx={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Chip
                label="5 Pending"
                size="small"
                sx={{
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
            </Stack>

            {/* Notifications */}
            <IconButton
              sx={{
                color: "#64748b",
                "&:hover": {
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }
              }}
            >
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Settings */}
            <IconButton
              sx={{
                color: "#64748b",
                "&:hover": {
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }
              }}
            >
              <Settings />
            </IconButton>

            {/* Profile Menu */}
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                color: "#64748b",
                "&:hover": {
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }
              }}
            >
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                A
              </Avatar>
            </IconButton>

            {/* Profile Menu */}
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }
              }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <AccountCircle sx={{ mr: 2 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <Settings sx={{ mr: 2 }} />
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleProfileMenuClose} sx={{ color: "error.main" }}>
                <Logout sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Enhanced Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Enhanced Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: { md: `${drawerWidth}px` },
            right: 0,
            bottom: 0,
            background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%23e2e8f0\" fill-opacity=\"0.5\"/></svg>') repeat",
            backgroundSize: "50px 50px",
            pointerEvents: "none",
            zIndex: 0,
          }
        }}
      >
        <Fade in timeout={500}>
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              pt: { xs: 10, md: 12 },
              pb: 3,
              px: { xs: 2, md: 4 },
            }}
          >
            {children}
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default DashboardLayout;