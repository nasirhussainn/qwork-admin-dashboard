// src/pages/Portfolios.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Typography,
  Tooltip,
  useMediaQuery,
  Divider,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  Button,
  Fade,
  Grow,
  useTheme,
  Grid,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Visibility,
  MoreVert,
  Delete,
  CheckCircle,
  Block,
  Search,
  FilterList,
  WorkspacePremium,
  Folder,
  TrendingUp,
  Assessment,
  CalendarToday,
  Person,
} from "@mui/icons-material";

import { fetchPortfolios, updatePortfolioStatus } from "../services/api";
import PortfolioDetailModal from "../components/PortfolioDetailModal";

const getStatusChip = (params) => {
  const status = params.value;
  const statusConfig = {
    pending: {
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      label: "PENDING",
      icon: "⏳",
    },
    approved: {
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      label: "APPROVED",
      icon: "✅",
    },
    rejected: {
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
      label: "REJECTED",
      icon: "❌",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Chip
      label={config.label}
      sx={{
        fontWeight: 700,
        fontSize: "0.75rem",
        height: 28,
        minWidth: 90,
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.color}20`,
        borderRadius: 2,
        "& .MuiChip-label": {
          px: 1.5,
        },
      }}
      icon={<Box sx={{ fontSize: "0.875rem", ml: 0.5 }}>{config.icon}</Box>}
    />
  );
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "";
  }
};

const Portfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isViewOpen, setViewOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isMobile = useMediaQuery("(max-width:768px)");
  const theme = useTheme();

  // Enhanced fetch portfolios with status filter
  const loadPortfolios = async (status = "all") => {
    try {
      setLoading(true);
      const data = await fetchPortfolios(1, 100);
      console.log("Portfolios API response:", data);

      const processedPortfolios = (data?.data || []).map((p) => ({
        ...p,
        formatted_date: formatDate(p.created_at),
      }));

      // Filter by status if not "all"
      const filteredPortfolios = status !== "all" 
        ? processedPortfolios.filter(p => p.status === status)
        : processedPortfolios;

      setPortfolios(filteredPortfolios);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      setNotification({
        open: true,
        message: "Failed to fetch portfolios",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios(statusFilter);
  }, [statusFilter]);

  const handleMenuClick = (event, portfolioId) => {
    setAnchorEl(event.currentTarget);
    setActiveMenuId(portfolioId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenuId(null);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleStatusUpdate = async (portfolioId, status) => {
    try {
      const res = await updatePortfolioStatus(portfolioId, status);
      setPortfolios(
        portfolios.map((p) =>
          p.portfolio_id === portfolioId ? { ...p, status } : p
        )
      );
      setNotification({
        open: true,
        message: `Portfolio status updated to "${status}" successfully`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating portfolio status:", error);
      setNotification({
        open: true,
        message: "Failed to update portfolio status",
        severity: "error",
      });
    }
    handleMenuClose();
  };

  const handleDelete = async (portfolioId) => {
    try {
      await deletePortfolio(portfolioId);
      setPortfolios(portfolios.filter((p) => p.portfolio_id !== portfolioId));
      setNotification({
        open: true,
        message: "Portfolio deleted successfully",
        severity: "warning",
      });
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      setNotification({
        open: true,
        message: "Failed to delete portfolio",
        severity: "error",
      });
    }
    handleMenuClose();
  };

  const handleView = (portfolio) => {
    setSelectedPortfolio(
      portfolios.find((p) => p.portfolio_id === portfolio.portfolio_id)
    );
    setViewOpen(true);
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  // Client-side search filtering
  const filteredPortfolios = portfolios.filter((portfolio) => {
    const matchesSearch =
      portfolio.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.portfolio_id?.toString().includes(searchTerm);
    return matchesSearch;
  });

  // Get stats for header
  const stats = {
    total: portfolios.length,
    approved: portfolios.filter((p) => p.status === "approved").length,
    pending: portfolios.filter((p) => p.status === "pending").length,
    rejected: portfolios.filter((p) => p.status === "rejected").length,
  };

  const statusFilterOptions = [
    { value: "all", label: "All Portfolios", color: "#64748b" },
    { value: "approved", label: "Approved", color: "#10b981" },
    { value: "pending", label: "Pending", color: "#f59e0b" },
    { value: "rejected", label: "Rejected", color: "#ef4444" },
  ];

  const columns = [
    {
      field: "portfolio_id",
      headerName: "ID",
      width: 90,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748b" }}>
          #{params.value}
        </Typography>
      ),
    },
    {
      field: "title",
      headerName: "Portfolio Title",
      width: 280,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "#1e293b",
            py: 1,
          }}
        >
          {params.value || "Untitled Portfolio"}
        </Typography>
      ),
    },
    {
      field: "user_id",
      headerName: "Owner",
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Person fontSize="small" sx={{ color: "#64748b" }} />
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              py: 1,
            }}
          >
            User #{params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: getStatusChip,
    },
    {
      field: "created_at",
      headerName: "Created",
      width: 150,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            py: 1,
          }}
        >
          {formatDate(params.value) || "N/A"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleView(params.row)}
              sx={{
                color: "#3b82f6",
                "&:hover": {
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Actions">
            <IconButton
              size="small"
              onClick={(e) => handleMenuClick(e, params.row.portfolio_id)}
              sx={{
                color: "#64748b",
                "&:hover": {
                  backgroundColor: "rgba(100, 116, 139, 0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && activeMenuId === params.row.portfolio_id}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid rgba(0,0,0,0.05)",
                mt: 1,
              },
            }}
          >
            <MenuItem
              disabled={params.row.status === "approved"}
              onClick={() => handleStatusUpdate(params.row.portfolio_id, "approved")}
              sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
            >
              <CheckCircle fontSize="small" sx={{ mr: 1, color: "#10b981" }} />
              Approve
            </MenuItem>
            <MenuItem
              disabled={params.row.status === "rejected"}
              onClick={() => handleStatusUpdate(params.row.portfolio_id, "rejected")}
              sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
            >
              <Block fontSize="small" sx={{ mr: 1, color: "#ef4444" }} />
              Reject
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              onClick={() => handleDelete(params.row.portfolio_id)}
              sx={{
                color: "error.main",
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
              }}
            >
              <Delete fontSize="small" sx={{ mr: 1 }} />
              Delete Portfolio
            </MenuItem>
          </Menu>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: 3,
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
            mb: 2,
          }}
        >
          <CircularProgress sx={{ color: "white" }} size={40} />
        </Box>
        <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 600 }}>
          Loading Portfolios...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      {/* Enhanced Header */}
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
              background:
                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="%23ffffff" fill-opacity="0.1" points="600,0 1000,0 1000,1000 800,1000"/></svg>\')',
              pointerEvents: "none",
            },
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <WorkspacePremium sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant={isMobile ? "h4" : "h3"}
                      sx={{ fontWeight: 700 }}
                    >
                      Portfolio Management
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ opacity: 0.9, fontWeight: 400 }}
                    >
                      Review and manage user portfolios
                    </Typography>
                  </Box>
                </Stack>

                {/* Stats Row */}
                <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                  {[
                    {
                      label: "Total Portfolios",
                      value: stats.total,
                      color: "rgba(255,255,255,0.9)",
                    },
                    {
                      label: "Approved",
                      value: stats.approved,
                      color: "#10b981",
                    },
                    {
                      label: "Pending",
                      value: stats.pending,
                      color: "#f59e0b",
                    },
                    { label: "Rejected", value: stats.rejected, color: "#ef4444" },
                  ].map((stat, index) => (
                    <Box key={index} sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: stat.color }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
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
                <Folder sx={{ fontSize: 60, opacity: 0.9 }} />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Enhanced Controls with Filters */}
      <Grow in timeout={1000}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Stack spacing={3}>
            {/* Search */}
            <TextField
              placeholder="Search portfolios by title or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#64748b" }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Status Filter Buttons */}
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <FilterList sx={{ color: "#64748b" }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1e293b" }}
                >
                  Filter by Status
                </Typography>
              </Stack>

              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={1}
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                {statusFilterOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => handleStatusFilterChange(option.value)}
                    variant={
                      statusFilter === option.value ? "contained" : "outlined"
                    }
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 600,
                      minWidth: 120,
                      ...(statusFilter === option.value
                        ? {
                            background: `linear-gradient(135deg, ${option.color} 0%, ${option.color}dd 100%)`,
                            color: "white",
                            border: "none",
                            boxShadow: `0 4px 12px ${option.color}40`,
                            "&:hover": {
                              boxShadow: `0 6px 16px ${option.color}60`,
                            },
                          }
                        : {
                            borderColor: option.color,
                            color: option.color,
                            "&:hover": {
                              backgroundColor: `${option.color}10`,
                              borderColor: option.color,
                            },
                          }),
                    }}
                  >
                    {option.label}
                    {statusFilter === option.value && (
                      <Chip
                        label={filteredPortfolios.length}
                        size="small"
                        sx={{
                          ml: 1,
                          height: 20,
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontSize: "0.75rem",
                        }}
                      />
                    )}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Grow>

      {/* Enhanced Data Grid */}
      <Fade in timeout={1200}>
        <Paper
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            },
          }}
        >
          <Box sx={{ height: "70vh", p: 0 }}>
            <DataGrid
              rows={filteredPortfolios}
              columns={columns}
              getRowId={(row) => row.portfolio_id}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25 },
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  sx: {
                    p: 2,
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    backgroundColor: "rgba(102, 126, 234, 0.02)",
                  },
                },
              }}
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "rgba(102, 126, 234, 0.05)",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#1e293b",
                  height: 56,
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid rgba(0,0,0,0.03)",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                },
                "& .MuiDataGrid-row": {
                  minHeight: 60,
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.02)",
                  },
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  backgroundColor: "rgba(102, 126, 234, 0.02)",
                },
                "& .MuiCheckbox-root": {
                  color: "#667eea",
                  "&.Mui-checked": {
                    color: "#667eea",
                  },
                },
                "& .MuiDataGrid-cellContent": {
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            />
          </Box>
        </Paper>
      </Fade>

      {selectedPortfolio && (
        <PortfolioDetailModal
          portfolio={selectedPortfolio}
          open={isViewOpen}
          onClose={() => setViewOpen(false)}
        />
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Portfolios;