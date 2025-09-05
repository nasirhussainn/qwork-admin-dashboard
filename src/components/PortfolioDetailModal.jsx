import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  CardMedia,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Paper,
  IconButton,
  Fade,
  Avatar,
  Button,
  Badge,
  Dialog,
  DialogContent,
  Alert,
} from "@mui/material";
import {
  Close,
  WorkspacePremium,
  Person,
  CalendarToday,
  Description,
  Image,
  Label,
  VideoLibrary,
  AttachFile,
  Visibility,
  ZoomIn,
  Assignment,
  Tag,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { fetchPortfolioById } from "../services/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "90%", md: 1200 },
  maxHeight: "95vh",
  bgcolor: "transparent",
  outline: "none",
};

const getStatusColor = (status) => {
  const colors = {
    approved: "#10b981",
    pending: "#f59e0b", 
    rejected: "#ef4444",
    hold: "#3b82f6"
  };
  return colors[status] || "#6b7280";
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "N/A";
  }
};

const PortfolioDetailModal = ({ portfolio, open, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  useEffect(() => {
    if (open && portfolio?.portfolio_id) {
      const loadDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          
          console.log("🔍 Fetching portfolio details for ID:", portfolio.portfolio_id);
          
          const response = await fetchPortfolioById(portfolio.portfolio_id);
          
          console.log("📦 API Response:", response);
          
          // Handle different response structures
          let portfolioData;
          if (response.data) {
            portfolioData = response.data;
          } else if (response.portfolio) {
            portfolioData = response.portfolio;
          } else if (Array.isArray(response)) {
            portfolioData = response[0];
          } else {
            portfolioData = response;
          }
          
          console.log("✅ Processed portfolio data:", portfolioData);
          
          setDetails(portfolioData);
        } catch (err) {
          console.error("❌ Failed to load portfolio details:", err);
          setError(err.message || "Failed to load portfolio details");
        } finally {
          setLoading(false);
        }
      };
      loadDetails();
    }
  }, [open, portfolio]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setDetails(null);
      setError(null);
      setSelectedImage(null);
      setImageDialogOpen(false);
    }
  }, [open]);

  if (!portfolio) return null;

  // Use details if available, fallback to original portfolio prop
  const portfolioData = details || portfolio;

  console.log("🎯 Current portfolio data being used:", portfolioData);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageDialogOpen(true);
  };

  return (
    <>
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
                    <Stack spacing={2}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 700, 
                          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          fontSize: { xs: "1.75rem", md: "2.25rem" }
                        }}
                      >
                        {portfolioData.title || "Untitled Portfolio"}
                      </Typography>
                      
                      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Person sx={{ fontSize: 18, opacity: 0.8 }} />
                          <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            User ID: {portfolioData.user_id}
                          </Typography>
                        </Box>
                        
                        <Chip
                          label={portfolioData.status?.toUpperCase() || "UNKNOWN"}
                          sx={{
                            bgcolor: getStatusColor(portfolioData.status),
                            color: "white",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          }}
                        />

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CalendarToday sx={{ fontSize: 16, opacity: 0.8 }} />
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Created: {formatDate(portfolioData.created_at)}
                          </Typography>
                        </Box>
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
                            bgcolor: portfolioData.status === 'approved' ? "#10b981" : 
                                    portfolioData.status === 'pending' ? "#f59e0b" : "#ef4444",
                            border: "3px solid white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Assignment sx={{ fontSize: 12, color: "white" }} />
                        </Box>
                      }
                    >
                      <Box
                        sx={{
                          width: { xs: 100, md: 140 },
                          height: { xs: 100, md: 140 },
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                          backdropFilter: "blur(10px)",
                          border: "4px solid rgba(255,255,255,0.3)",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        }}
                      >
                        <WorkspacePremium sx={{ fontSize: { xs: 40, md: 60 }, opacity: 0.9 }} />
                      </Box>
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
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 300,
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <CircularProgress size={60} sx={{ color: "#667eea" }} />
                    <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 600 }}>
                      Loading Portfolio Details...
                    </Typography>
                  </Box>
                ) : error ? (
                  <Box sx={{ p: 3 }}>
                    <Alert 
                      severity="error" 
                      icon={<ErrorIcon />}
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Failed to Load Portfolio Details
                      </Typography>
                      <Typography variant="body2">
                        {error}
                      </Typography>
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                      Showing basic portfolio information instead:
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {/* Quick Info Cards */}
                    <Box sx={{ p: 3, pb: 0 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card sx={{ bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <WorkspacePremium sx={{ color: "#64748b", fontSize: 20 }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Portfolio ID
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    #{portfolioData.portfolio_id}
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
                                <Image sx={{ color: "#d97706", fontSize: 20 }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Images
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {portfolioData.portfolio_images?.length || 0} Files
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
                                <Tag sx={{ color: "#2563eb", fontSize: 20 }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Keywords
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {portfolioData.portfolio_keywords?.length || 0} Tags
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
                                    Last Updated
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {formatDate(portfolioData.updated_at)}
                                  </Typography>
                                </Box>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ p: 3 }}>
                      {/* Description */}
                      <Card sx={{ mb: 3, border: "1px solid #e2e8f0" }}>
                        <CardContent sx={{ p: 3 }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <Description sx={{ color: "#667eea", fontSize: 24 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: "#667eea" }}>
                              Portfolio Description
                            </Typography>
                          </Stack>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              lineHeight: 1.7, 
                              color: "#475569",
                              fontSize: "1rem",
                              minHeight: "1.5em"
                            }}
                          >
                            {portfolioData.description || "No description provided for this portfolio."}
                          </Typography>
                        </CardContent>
                      </Card>

                      {/* Keywords */}
                      <Card sx={{ mb: 3, border: "1px solid #e2e8f0" }}>
                        <CardContent sx={{ p: 3 }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <Label sx={{ color: "#059669", fontSize: 24 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: "#059669" }}>
                              Keywords & Tags
                            </Typography>
                            <Chip 
                              label={`${portfolioData.portfolio_keywords?.length || 0} ${(portfolioData.portfolio_keywords?.length || 0) === 1 ? 'Keyword' : 'Keywords'}`}
                              size="small"
                              sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 600 }}
                            />
                          </Stack>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {portfolioData.portfolio_keywords?.length ? (
                              portfolioData.portfolio_keywords.map((kw) => (
                                <Chip
                                  key={kw.id}
                                  label={kw.keyword}
                                  sx={{
                                    background: "linear-gradient(135deg, #059669, #10b981)",
                                    color: "white",
                                    fontWeight: 600,
                                    mb: 1,
                                    "&:hover": {
                                      background: "linear-gradient(135deg, #047857, #059669)",
                                    }
                                  }}
                                />
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                No keywords provided for this portfolio.
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>

                      {/* Portfolio Images Gallery */}
                      {portfolioData.portfolio_images?.length > 0 && (
                        <Card sx={{ mb: 3, border: "1px solid #e2e8f0" }}>
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                              <Image sx={{ color: "#dc2626", fontSize: 24 }} />
                              <Typography variant="h5" sx={{ fontWeight: 700, color: "#dc2626" }}>
                                Portfolio Gallery
                              </Typography>
                              <Chip 
                                label={`${portfolioData.portfolio_images.length} ${portfolioData.portfolio_images.length === 1 ? 'Image' : 'Images'}`}
                                size="small"
                                sx={{ bgcolor: "#fef2f2", color: "#dc2626", fontWeight: 600 }}
                              />
                            </Stack>

                            {/* Image Gallery */}
                            <Grid container spacing={2}>
                              {portfolioData.portfolio_images.map((img, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={img.id}>
                                  <Paper
                                    sx={{
                                      borderRadius: 3,
                                      overflow: "hidden",
                                      position: "relative",
                                      cursor: "pointer",
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                      transition: "all 0.3s ease",
                                      "&:hover": {
                                        transform: "translateY(-8px)",
                                        boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                                      }
                                    }}
                                    onClick={() => handleImageClick(img.url)}
                                  >
                                    <CardMedia
                                      component="img"
                                      height="220"
                                      image={img.url}
                                      alt={`${portfolioData.title} - Image ${idx + 1}`}
                                      sx={{ 
                                        objectFit: "cover",
                                        transition: "transform 0.3s ease",
                                      }}
                                    />
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: "linear-gradient(45deg, transparent 60%, rgba(0,0,0,0.7))",
                                        opacity: 0,
                                        transition: "opacity 0.3s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        "&:hover": {
                                          opacity: 1,
                                        }
                                      }}
                                    >
                                      <IconButton
                                        sx={{ 
                                          color: "white",
                                          bgcolor: "rgba(255,255,255,0.2)",
                                          "&:hover": {
                                            bgcolor: "rgba(255,255,255,0.3)",
                                          }
                                        }}
                                      >
                                        <ZoomIn sx={{ fontSize: 32 }} />
                                      </IconButton>
                                    </Box>
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: 12,
                                        right: 12,
                                        bgcolor: "rgba(0,0,0,0.8)",
                                        borderRadius: 2,
                                        px: 1.5,
                                        py: 0.5,
                                      }}
                                    >
                                      <Typography variant="caption" sx={{ color: "white", fontWeight: 700 }}>
                                        {idx + 1} / {portfolioData.portfolio_images.length}
                                      </Typography>
                                    </Box>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                          </CardContent>
                        </Card>
                      )}

                      {/* Additional Files Section */}
                      <Grid container spacing={3}>
                        {/* Video */}
                        <Grid item xs={12} md={6}>
                          <Card sx={{ height: "100%", border: "1px solid #e2e8f0" }}>
                            <CardContent sx={{ p: 3 }}>
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <VideoLibrary sx={{ color: "#7c3aed", fontSize: 24 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#7c3aed" }}>
                                  Portfolio Video
                                </Typography>
                              </Stack>
                              {portfolioData.video ? (
                                <Box>
                                  <Paper sx={{ p: 2, bgcolor: "#f8f4ff", border: "1px solid #e0e7ff" }}>
                                    <Typography variant="body2" sx={{ color: "#5b21b6", fontWeight: 600, mb: 1 }}>
                                      📹 Video file attached
                                    </Typography>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      startIcon={<Visibility />}
                                      href={portfolioData.video}
                                      target="_blank"
                                      sx={{ 
                                        bgcolor: "#7c3aed",
                                        "&:hover": { bgcolor: "#6d28d9" }
                                      }}
                                    >
                                      Watch Video
                                    </Button>
                                  </Paper>
                                </Box>
                              ) : (
                                <Box sx={{ textAlign: "center", py: 3 }}>
                                  <VideoLibrary sx={{ fontSize: 48, color: "#d1d5db", mb: 1 }} />
                                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                    No video file attached
                                  </Typography>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>

                        {/* Supporting Documents */}
                        <Grid item xs={12} md={6}>
                          <Card sx={{ height: "100%", border: "1px solid #e2e8f0" }}>
                            <CardContent sx={{ p: 3 }}>
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <AttachFile sx={{ color: "#f59e0b", fontSize: 24 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#f59e0b" }}>
                                  Supporting Documents
                                </Typography>
                              </Stack>
                              {portfolioData.supporting_document ? (
                                <Box>
                                  <Paper sx={{ p: 2, bgcolor: "#fffbeb", border: "1px solid #fde68a" }}>
                                    <Typography variant="body2" sx={{ color: "#d97706", fontWeight: 600, mb: 1 }}>
                                      📄 Document attached
                                    </Typography>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      startIcon={<Visibility />}
                                      href={portfolioData.supporting_document}
                                      target="_blank"
                                      sx={{ 
                                        bgcolor: "#f59e0b",
                                        "&:hover": { bgcolor: "#d97706" }
                                      }}
                                    >
                                      View Document
                                    </Button>
                                  </Paper>
                                </Box>
                              ) : (
                                <Box sx={{ textAlign: "center", py: 3 }}>
                                  <AttachFile sx={{ fontSize: 48, color: "#d1d5db", mb: 1 }} />
                                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                    No supporting documents attached
                                  </Typography>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Modal>

      {/* Image Zoom Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            onClick={() => setImageDialogOpen(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              zIndex: 10,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Portfolio full view"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PortfolioDetailModal;