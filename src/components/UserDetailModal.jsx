// src/components/UserDetailModal.js
import React from "react";
import {
  Modal,
  Box,
  Typography,
  Avatar,
  Grid,
  Chip,
  Divider,
  Stack,
  Card,
  CardContent,
  Badge,
  Paper,
  IconButton,
  Fade,
} from "@mui/material";
import {
  LocationOn,
  Work,
  School,
  CalendarToday,
  Email,
  Person,
  Close,
  AccessTime,
  AttachMoney,
} from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "90%", md: 1000 },
  maxHeight: "95vh",
  bgcolor: "transparent",
  outline: "none",
};

const formatDate = (date) => {
  if (!date) return "Present";
  try {
    if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      const [day, month, year] = date.split("-");
      return new Date(`${year}-${month}-${day}`).toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  } catch {
    return "N/A";
  }
};

const UserDetailModal = ({ user, open, onClose }) => {
  if (!user) return null;

  const truncateSummary = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > 200 ? words.slice(0, 200).join(" ") + "..." : text;
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: "#10b981",
      pending: "#f59e0b", 
      rejected: "#ef4444",
      banned: "#6b7280",
      hold: "#3b82f6"
    };
    return colors[status] || "#6b7280";
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      closeAfterTransition
      sx={{ backdropFilter: "blur(8px)" }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                zIndex: 10,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <Close />
            </IconButton>

            {/* Header Section with Gradient Background */}
            <Box sx={{ p: 4, pb: 2, color: "white", position: "relative" }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Stack spacing={1}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 700, 
                        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        fontSize: { xs: "2rem", md: "2.5rem" }
                      }}
                    >
                      {`${user.profile?.first_name || ""} ${user.profile?.last_name || ""}`}
                    </Typography>
                    
                    {user.profile?.professional_headshot && (
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          opacity: 0.9, 
                          fontWeight: 500,
                          fontStyle: "italic",
                          fontSize: { xs: "1rem", md: "1.25rem" }
                        }}
                      >
                        "{user.profile.professional_headshot}"
                      </Typography>
                    )}

                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Email sx={{ fontSize: 18, opacity: 0.8 }} />
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          {user.email}
                        </Typography>
                      </Box>
                      
                      <Chip
                        label={user.status?.toUpperCase()}
                        sx={{
                          bgcolor: getStatusColor(user.status),
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                      />
                    </Stack>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={4} textAlign="center">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: user.is_active ? "#10b981" : "#ef4444",
                          border: "3px solid white",
                        }}
                      />
                    }
                  >
                    <Avatar
                      src={user.profile?.profile_image}
                      sx={{
                        width: { xs: 100, md: 140 },
                        height: { xs: 100, md: 140 },
                        border: "4px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      }}
                    />
                  </Badge>
                </Grid>
              </Grid>
            </Box>

            {/* Content Area */}
            <Box
              sx={{
                bgcolor: "background.paper",
                p: 0,
                maxHeight: "70vh",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#c1c1c1",
                  borderRadius: "3px",
                },
              }}
            >
              {/* Quick Info Cards */}
              <Box sx={{ p: 3, pb: 0 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationOn sx={{ color: "#64748b", fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Location
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {`${user.profile?.city || "N/A"}, ${user.profile?.state || ""}`}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "#fef3c7", border: "1px solid #fcd34d" }}>
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Work sx={{ color: "#d97706", fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Experience
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {user.profile?.years_of_experience || "0 years"}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "#dbeafe", border: "1px solid #60a5fa" }}>
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccessTime sx={{ color: "#2563eb", fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Availability
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {user.profile?.availability || "N/A"}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: "#dcfce7", border: "1px solid #4ade80" }}>
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarToday sx={{ color: "#16a34a", fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Date of Birth
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {formatDate(user.profile?.date_of_birth)}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              {/* Pricing Section - if available */}
              {user.pricing && (
                <Box sx={{ p: 3, pt: 2 }}>
                  <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <AttachMoney sx={{ color: "white", fontSize: 24 }} />
                        <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                          Pricing Information
                        </Typography>
                      </Stack>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                            Hourly Rate
                          </Typography>
                          <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                            ${user.pricing.hourly_rate}/hr
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                            Min Project Rate
                          </Typography>
                          <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                            ${user.pricing.min_project_rate}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                            Rate Type
                          </Typography>
                          <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                            {user.pricing.rate_type?.toUpperCase()}
                          </Typography>
                        </Grid>
                      </Grid>
                      {user.pricing.pricing_description && (
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", mt: 2 }}>
                          {user.pricing.pricing_description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              )}

              <Box sx={{ p: 3 }}>
                {/* Professional Summary */}
                <Card sx={{ mb: 3, border: "1px solid #e2e8f0" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
                      Professional Summary
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.7, 
                        color: "#475569",
                        fontSize: "1rem"
                      }}
                    >
                      {truncateSummary(user.profile?.professional_summary) || "No summary provided"}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Skills & Professions */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: "100%", border: "1px solid #e2e8f0" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#7c3aed", mb: 2 }}>
                          Professions
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {user.interests?.categories?.length ? (
                            user.interests.categories.map((cat) => (
                              <Chip
                                key={`cat-${cat.id}`}
                                label={cat.name}
                                sx={{
                                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                                  color: "white",
                                  fontWeight: 600,
                                  mb: 1,
                                  "&:hover": {
                                    background: "linear-gradient(135deg, #6d28d9, #9333ea)",
                                  }
                                }}
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No professions listed
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: "100%", border: "1px solid #e2e8f0" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#059669", mb: 2 }}>
                          Skills
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {user.interests?.keywords?.length ? (
                            user.interests.keywords.map((skill) => (
                              <Chip
                                key={`skill-${skill.id}`}
                                label={skill.name}
                                variant="outlined"
                                sx={{
                                  borderColor: "#059669",
                                  color: "#059669",
                                  fontWeight: 600,
                                  mb: 1,
                                  "&:hover": {
                                    bgcolor: "#ecfdf5",
                                  }
                                }}
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No skills listed
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Experience */}
                <Card sx={{ mb: 3, border: "1px solid #e2e8f0" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                      <Work sx={{ color: "#dc2626", fontSize: 24 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "#dc2626" }}>
                        Work Experience
                      </Typography>
                    </Stack>
                    
                    {Array.isArray(user.experiences) && user.experiences.length > 0 ? (
                      <Stack spacing={3}>
                        {user.experiences.map((exp, index) => (
                          <Box key={exp.id}>
                            <Paper 
                              sx={{ 
                                p: 3, 
                                bgcolor: "#fef7f0", 
                                border: "1px solid #fed7aa",
                                position: "relative"
                              }}
                            >
                              {exp.is_current && (
                                <Chip
                                  label="Current"
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    top: 16,
                                    right: 16,
                                    bgcolor: "#10b981",
                                    color: "white",
                                    fontWeight: 600
                                  }}
                                />
                              )}
                              <Typography variant="h6" sx={{ fontWeight: 700, color: "#9a3412" }}>
                                {exp.job_title}
                              </Typography>
                              <Typography variant="subtitle1" sx={{ color: "#ea580c", fontWeight: 600 }}>
                                {exp.company_name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#78716c", mb: 1 }}>
                                {exp.location} • {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                              </Typography>
                              <Typography variant="body1" sx={{ color: "#57534e", lineHeight: 1.6 }}>
                                {exp.description}
                              </Typography>
                            </Paper>
                            {index < user.experiences.length - 1 && <Divider sx={{ my: 2 }} />}
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        No work experience added
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* Education */}
                <Card sx={{ border: "1px solid #e2e8f0" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                      <School sx={{ color: "#2563eb", fontSize: 24 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "#2563eb" }}>
                        Education
                      </Typography>
                    </Stack>
                    
                    {Array.isArray(user.education) && user.education.length > 0 ? (
                      <Stack spacing={3}>
                        {user.education.map((edu, index) => (
                          <Box key={edu.id}>
                            <Paper 
                              sx={{ 
                                p: 3, 
                                bgcolor: "#eff6ff", 
                                border: "1px solid #bfdbfe"
                              }}
                            >
                              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1d4ed8" }}>
                                {edu.degree} in {edu.field_of_study}
                              </Typography>
                              <Typography variant="subtitle1" sx={{ color: "#3b82f6", fontWeight: 600 }}>
                                {edu.institution_name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                                {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                                {edu.grade && ` • Grade: ${edu.grade}`}
                              </Typography>
                              {edu.description && (
                                <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.6 }}>
                                  {edu.description}
                                </Typography>
                              )}
                            </Paper>
                            {index < user.education.length - 1 && <Divider sx={{ my: 2 }} />}
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        No education information added
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UserDetailModal;