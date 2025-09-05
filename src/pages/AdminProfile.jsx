import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  Box,
  useMediaQuery,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  Fade,
  Grow,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Person,
  Email,
  Security,
  AdminPanelSettings,
  LockReset,
  Edit,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { getAdminProfile, adminResetPassword } from "../services/api";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [statsLoaded, setStatsLoaded] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");
  const theme = useTheme();

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const response = await getAdminProfile();
        console.log("API Response:", response); // For debugging
        
        // Fix: Access the admin object from the response
        setAdminData(response.admin || response);
        
        // Simulate stats loading with delay for animation
        setTimeout(() => setStatsLoaded(true), 300);
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        setAlert({
          show: true,
          type: "error",
          message: "Failed to load admin profile"
        });
        setTimeout(() => setStatsLoaded(true), 300);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handlePasswordReset = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({
        show: true,
        type: "error",
        message: "Passwords do not match"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setAlert({
        show: true,
        type: "error",
        message: "Password must be at least 6 characters long"
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await adminResetPassword(passwordData.newPassword, passwordData.confirmPassword);
      setAlert({
        show: true,
        type: "success",
        message: "Password reset successfully!"
      });
      setResetPasswordOpen(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: err.response?.data?.message || "Failed to reset password"
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: 3
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2
          }}
        >
          <CircularProgress sx={{ color: "white" }} size={40} />
        </Box>
        <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 600 }}>
          Loading Admin Profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      {/* Alert */}
      {alert.show && (
        <Fade in timeout={300}>
          <Alert
            severity={alert.type}
            onClose={handleCloseAlert}
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {alert.message}
          </Alert>
        </Fade>
      )}

      {/* Header */}
      <Fade in timeout={800}>
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 4,
            color: "white",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "40%",
              height: "100%",
              background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 1000\"><polygon fill=\"%23ffffff\" fill-opacity=\"0.1\" points=\"600,0 1000,0 1000,1000 800,1000\"/></svg>')",
              pointerEvents: "none",
            }
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={1}>
                <Typography variant={isMobile ? "h4" : "h3"} sx={{ fontWeight: 700 }}>
                  Admin Profile
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  Manage your administrative account settings
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
                  Last updated: {formatDate(adminData?.updated_at)}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  backdropFilter: "blur(10px)",
                }}
              >
                <AdminPanelSettings sx={{ fontSize: 60, opacity: 0.9 }} />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Profile Information Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: "Admin ID",
            value: adminData?.id?.toString() || "N/A",
            icon: <Person sx={{ fontSize: 40 }} />,
            color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            delay: 100
          },
          {
            title: "Email Address",
            value: adminData?.email || "N/A",
            icon: <Email sx={{ fontSize: 40 }} />,
            color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            delay: 200
          },
          {
            title: "Role",
            value: adminData?.role || "Administrator",
            icon: <Security sx={{ fontSize: 40 }} />,
            color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            delay: 300
          },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Grow in={statsLoaded} timeout={item.delay}>
              <Card
                sx={{
                  background: item.color,
                  color: "white",
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                  },
                  transition: "all 0.3s ease",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "50%",
                    height: "100%",
                    background: "rgba(255,255,255,0.1)",
                    clipPath: "polygon(50% 0%, 100% 0%, 100% 100%)",
                  }
                }}
              >
                <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 600, mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          wordBreak: "break-word",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical"
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                    <Box sx={{ opacity: 0.8, ml: 2 }}>
                      {item.icon}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Security Section */}
      <Fade in timeout={1000}>
        <Paper 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
            }
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "white",
                }}
              >
                <LockReset />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                  Security Settings
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Manage your account security and password
                </Typography>
              </Box>
            </Stack>
            
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setResetPasswordOpen(true)}
              sx={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(245, 158, 11, 0.4)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Reset Password
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  Password Security
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Keep your account secure by using a strong password and updating it regularly.
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircle sx={{ color: "#10b981", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Password last updated: {formatDate(adminData?.updated_at)}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  Account Status
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Your administrative account is {adminData?.is_active ? 'active' : 'inactive'} and secure.
                </Typography>
                <Chip
                  icon={<CheckCircle />}
                  label={`${adminData?.is_active ? 'Active' : 'Inactive'} ${adminData?.role || 'Administrator'}`}
                  sx={{
                    background: adminData?.is_active 
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "linear-gradient(135deg, #ef4444, #dc2626)",
                    color: "white",
                    fontWeight: 600,
                    alignSelf: "flex-start",
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Reset Password Dialog */}
      <Dialog
        open={resetPasswordOpen}
        onClose={() => {
          setResetPasswordOpen(false);
          setPasswordData({ newPassword: "", confirmPassword: "" });
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "white",
              }}
            >
              <LockReset />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Reset Password
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Create a new secure password for your account
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                }
              }}
            />

            {passwordData.newPassword && passwordData.newPassword.length < 6 && (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                Password must be at least 6 characters long
              </Alert>
            )}

            {passwordData.newPassword && passwordData.confirmPassword && 
             passwordData.newPassword !== passwordData.confirmPassword && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                Passwords do not match
              </Alert>
            )}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => {
              setResetPasswordOpen(false);
              setPasswordData({ newPassword: "", confirmPassword: "" });
            }}
            sx={{ 
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordReset}
            variant="contained"
            disabled={
              !passwordData.newPassword || 
              !passwordData.confirmPassword || 
              passwordData.newPassword !== passwordData.confirmPassword ||
              passwordData.newPassword.length < 6 ||
              passwordLoading
            }
            sx={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
              },
            }}
          >
            {passwordLoading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Reset Password"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProfile;