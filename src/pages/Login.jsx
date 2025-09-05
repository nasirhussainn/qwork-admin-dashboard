import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Stack,
  CircularProgress,
  Fade,
  Grow,
  Grid,
  Container,
  Backdrop,
  keyframes,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  LoginRounded,
  AdminPanelSettings,
  Security,
  Dashboard,
  Analytics,
  People,
  Speed,
  Verified,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/api";

// Animation keyframes
const float = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(2deg);
  }
  66% {
    transform: translateY(5px) rotate(-1deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
`;

const slideInLeft = keyframes`
  0% {
    transform: translateX(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInRight = keyframes`
  0% {
    transform: translateX(100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const successPulse = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await adminLogin(formData.email, formData.password);
      if (response.refreshToken) {
        localStorage.setItem("adminToken", response.accessToken);
      } else {
        localStorage.setItem("adminToken", "authenticated");
      }

      if (response.user) {
        localStorage.setItem("adminUser", JSON.stringify(response.user));
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/home", { replace: true });
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 50% 20%, rgba(240, 147, 251, 0.1) 0%, transparent 60%)
          `,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="50" cy="50" r="1" fill="%23ffffff" fill-opacity="0.05"/><circle cx="150" cy="80" r="1" fill="%23ffffff" fill-opacity="0.03"/><circle cx="80" cy="150" r="1" fill="%23ffffff" fill-opacity="0.04"/><circle cx="180" cy="160" r="1" fill="%23ffffff" fill-opacity="0.03"/><circle cx="20" cy="120" r="1" fill="%23ffffff" fill-opacity="0.05"/></svg>\') repeat',
          backgroundSize: "200px 200px",
          pointerEvents: "none",
        },
      }}
    >
      {/* Floating decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "8%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 100%)",
          animation: `${float} 8s ease-in-out infinite`,
          backdropFilter: "blur(10px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          right: "10%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)",
          animation: `${float} 12s ease-in-out infinite reverse`,
          backdropFilter: "blur(10px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "15%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(240, 147, 251, 0.05) 100%)",
          animation: `${float} 10s ease-in-out infinite`,
          backdropFilter: "blur(10px)",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{ minHeight: "100vh", display: "flex", alignItems: "center", p: 0 }}
      >
        <Grid container sx={{ minHeight: "100vh", width: "100%" }}>
          {/* Left Side - Branding & Info */}
          <Grid
            item
            xs={12}
            lg={7}
            sx={{ display: "flex", alignItems: "center", position: "relative" }}
          >
            <Fade in timeout={800}>
              <Box
                sx={{
                  p: { xs: 4, md: 6, lg: 8 },
                  color: "white",
                  animation: `${slideInLeft} 0.8s ease-out`,
                  width: "100%",
                  maxWidth: { xs: "100%", lg: "90%" },
                }}
              >
                {/* Logo and Brand */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={3}
                  sx={{ mb: 6 }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
                    }}
                  >
                    <AdminPanelSettings sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      Q-Work
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ opacity: 0.8, fontWeight: 400 }}
                    >
                      Admin Dashboard
                    </Typography>
                  </Box>
                </Stack>

                {/* Main Content */}
                <Typography
                  variant="h2"
                  sx={{ fontWeight: 700, mb: 3, lineHeight: 1.2 }}
                >
                  Manage Your Platform
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    With Confidence
                  </span>
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ opacity: 0.8, mb: 6, lineHeight: 1.6, maxWidth: 500 }}
                >
                  Access your comprehensive admin dashboard to monitor users,
                  manage portfolios, and oversee your entire platform from one
                  powerful interface.
                </Typography>

                {/* Feature Cards */}
                <Grid container spacing={3} sx={{ mt: 2, maxWidth: 600 }}>
                  {[
                    {
                      icon: <Analytics />,
                      title: "Advanced Analytics",
                      desc: "Real-time insights",
                    },
                    {
                      icon: <People />,
                      title: "User Management",
                      desc: "Complete control",
                    },
                    {
                      icon: <Security />,
                      title: "Secure Access",
                      desc: "Enterprise security",
                    },
                  ].map((feature, index) => (
                    <Grid item xs={6} key={index}>
                      <Grow in timeout={1000 + index * 200}>
                        <Paper
                          sx={{
                            p: 3,
                            background: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: 3,
                            color: "white",
                            textAlign: "center",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255,255,255,0.15)",
                              transform: "translateY(-5px)",
                            },
                          }}
                        >
                          <Box sx={{ color: "#667eea", mb: 2 }}>
                            {feature.icon}
                          </Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {feature.desc}
                          </Typography>
                        </Paper>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid
            item
            xs={12}
            lg={5}
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              justifyContent: "flex-end", // Move content to the right
              pl: { lg: 4 }, // Add left padding on large screens
            }}
          >
            <Fade in timeout={800}>
              <Paper
                sx={{
                  width: "140%", // Increased from 120% to 140%
                  maxWidth: { xs: "100%", sm: "90%", lg: "95%" }, // Increased max widths
                  mx: { xs: "auto", lg: 0 }, // Remove auto margin on large screens
                  mr: { lg: 2 }, // Add right margin on large screens
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.98)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 32px 64px rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  animation: `${slideInRight} 0.8s ease-out`,
                  position: "relative",
                }}
              >
                {/* Rest of your form content remains the same */}
                {/* Form Header */}
                <Box
                  sx={{
                    p: 4,
                    background:
                      "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                    color: "white",
                    textAlign: "center",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background:
                        "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                    },
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Sign in to access your dashboard
                  </Typography>
                </Box>

                {/* Form Content */}
                <Box sx={{ p: 5, position: "relative" }}>
                  {" "}
                  {/* Increased padding from 4 to 5 */}
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      {error && (
                        <Grow in timeout={300}>
                          <Alert
                            severity="error"
                            sx={{
                              borderRadius: 3,
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              background: "rgba(239, 68, 68, 0.05)",
                            }}
                          >
                            {error}
                          </Alert>
                        </Grow>
                      )}

                      <Grow in timeout={400}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: "#667eea" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              background: loading
                                ? "rgba(248, 250, 252, 0.5)"
                                : "rgba(248, 250, 252, 0.8)",
                              transition: "all 0.3s ease",
                              "&:hover fieldset": {
                                borderColor: loading ? "#94a3b8" : "#667eea",
                                borderWidth: "2px",
                              },
                              "&.Mui-focused": {
                                background: loading
                                  ? "rgba(248, 250, 252, 0.5)"
                                  : "white",
                                "& fieldset": {
                                  borderColor: "#667eea",
                                  borderWidth: "2px",
                                  boxShadow: loading
                                    ? "none"
                                    : "0 0 0 3px rgba(102, 126, 234, 0.1)",
                                },
                              },
                              "&.Mui-disabled": {
                                background: "rgba(248, 250, 252, 0.5)",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#667eea",
                              fontWeight: 600,
                            },
                          }}
                        />
                      </Grow>

                      <Grow in timeout={600}>
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock sx={{ color: "#667eea" }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleTogglePassword}
                                  edge="end"
                                  disabled={loading}
                                  sx={{ color: "#64748b" }}
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              background: loading
                                ? "rgba(248, 250, 252, 0.5)"
                                : "rgba(248, 250, 252, 0.8)",
                              transition: "all 0.3s ease",
                              "&:hover fieldset": {
                                borderColor: loading ? "#94a3b8" : "#667eea",
                                borderWidth: "2px",
                              },
                              "&.Mui-focused": {
                                background: loading
                                  ? "rgba(248, 250, 252, 0.5)"
                                  : "white",
                                "& fieldset": {
                                  borderColor: "#667eea",
                                  borderWidth: "2px",
                                  boxShadow: loading
                                    ? "none"
                                    : "0 0 0 3px rgba(102, 126, 234, 0.1)",
                                },
                              },
                              "&.Mui-disabled": {
                                background: "rgba(248, 250, 252, 0.5)",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#667eea",
                              fontWeight: 600,
                            },
                          }}
                        />
                      </Grow>

                      <Grow in timeout={800}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading}
                          startIcon={
                            loading ? (
                              <CircularProgress
                                size={20}
                                sx={{ color: "white" }}
                              />
                            ) : success ? (
                              <CheckCircle />
                            ) : (
                              <LoginRounded />
                            )
                          }
                          sx={{
                            py: 2.5,
                            borderRadius: 3,
                            background: success
                              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            textTransform: "none",
                            boxShadow: success
                              ? "0 12px 32px rgba(16, 185, 129, 0.4)"
                              : "0 12px 32px rgba(102, 126, 234, 0.4)",
                            animation: loading
                              ? `${pulse} 2s ease-in-out infinite`
                              : success
                              ? `${successPulse} 0.6s ease-out`
                              : "none",
                            "&:hover": {
                              background: success
                                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                : loading
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                : "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                              boxShadow: success
                                ? "0 16px 40px rgba(16, 185, 129, 0.5)"
                                : "0 16px 40px rgba(102, 126, 234, 0.5)",
                              transform: loading ? "none" : "translateY(-2px)",
                            },
                            "&:disabled": {
                              background: loading
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                : "#94a3b8",
                              color: "white",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          {loading
                            ? "Authenticating..."
                            : success
                            ? "Success! Redirecting..."
                            : "Access Dashboard"}
                        </Button>
                      </Grow>
                    </Stack>
                  </form>
                  {/* Security Badge */}
                  <Grow in timeout={1000}>
                    <Box
                      sx={{
                        mt: 4,
                        p: 3,
                        borderRadius: 3,
                        background: success
                          ? "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)"
                          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                        border: success
                          ? "2px solid #10b981"
                          : "2px solid #e2e8f0",
                        textAlign: "center",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{ mb: 1 }}
                      >
                        {success ? (
                          <CheckCircle
                            sx={{
                              color: "#10b981",
                              fontSize: 24,
                              animation: `${successPulse} 0.6s ease-out`,
                            }}
                          />
                        ) : (
                          <Verified sx={{ color: "#10b981", fontSize: 24 }} />
                        )}
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "#1e293b" }}
                        >
                          {success ? "Login Successful" : "Secure Login"}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", fontWeight: 500 }}
                      >
                        {success
                          ? "Welcome back! Taking you to your dashboard..."
                          : "Protected by enterprise-grade encryption"}
                      </Typography>
                    </Box>
                  </Grow>
                </Box>

                {/* Loading Overlay */}
                {loading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(4px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                      borderRadius: 4,
                    }}
                  >
                    <Stack alignItems="center" spacing={3}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          animation: `${pulse} 2s ease-in-out infinite`,
                          boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
                        }}
                      >
                        <Dashboard sx={{ fontSize: 40, color: "white" }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#1e293b" }}
                      >
                        Authenticating...
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          textAlign: "center",
                          maxWidth: 250,
                        }}
                      >
                        Please wait while we verify your credentials and prepare
                        your dashboard.
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
