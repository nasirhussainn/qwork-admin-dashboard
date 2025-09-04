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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Visibility,
  MoreVert,
  Delete,
  CheckCircle,
  Block,
  PauseCircle,
} from "@mui/icons-material";

import { fetchPortfolios, updatePortfolioStatus } from "../services/api"; 
import PortfolioDetailModal from "../components/PortfolioDetailModal";

// --- Helpers ---
const getStatusChip = (params) => {
  const status = params.value;
  const colorMap = {
    pending: "warning",
    approved: "success",
    rejected: "error",
  };
  return (
    <Chip
      label={status?.toUpperCase() || "N/A"}
      color={colorMap[status] || "default"}
      size="small"
      sx={{ fontWeight: "bold", minWidth: 85 }}
    />
  );
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  } catch (error) {
    return "N/A";
  }
};

const Portfolios = () => {
  // --- State ---
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isViewOpen, setViewOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isMobile = useMediaQuery("(max-width:768px)");

  // --- Fetch Data from API ---
  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        setLoading(true);
        const data = await fetchPortfolios(1, 100); // ✅ fetch from API
        console.log("Portfolios API response:", data);
        setPortfolios(data?.data || []); // assuming API response has { data: [...] }
      } catch (error) {
        console.error("Error fetching portfolios:", error);
        setNotification({
          open: true,
          message: "Failed to load portfolios.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    loadPortfolios();
  }, []);

  // --- Handlers ---
  const handleMenuClick = (event, portfolioId) => {
    setAnchorEl(event.currentTarget);
    setActiveMenuId(portfolioId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenuId(null);
  };

// --- Handlers ---
const handleStatusUpdate = async (portfolioId, status) => {
  try {
    // 🔄 Call API
    await updatePortfolioStatus(portfolioId, status);

    // ✅ Update local state if API succeeds
    setPortfolios(
      portfolios.map((p) =>
        p.portfolio_id === portfolioId ? { ...p, status } : p
      )
    );

    setNotification({
      open: true,
      message: `Portfolio status updated to ${status}`,
      severity: "success",
    });
  } catch (error) {
    console.error("Error updating portfolio status:", error);
    setNotification({
      open: true,
      message: "Failed to update portfolio status.",
      severity: "error",
    });
  } finally {
    handleMenuClose();
  }
};


  const handleDelete = (portfolioId) => {
    setPortfolios(portfolios.filter((p) => p.portfolio_id !== portfolioId));
    setNotification({
      open: true,
      message: "Portfolio deleted successfully",
      severity: "warning",
    });
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

  // --- Columns ---
  const columns = [
    { field: "portfolio_id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", width: 220 },
    { field: "user_id", headerName: "User ID", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: getStatusChip,
    },
    {
      field: "created_at",
      headerName: "Date Created",
      width: 160,
      renderCell: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleView(params.row)}
              color="primary"
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options">
            <IconButton
              size="small"
              onClick={(e) => handleMenuClick(e, params.row.portfolio_id)}
            >
              <MoreVert />
            </IconButton>
          </Tooltip>

          {/* Actions Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && activeMenuId === params.row.portfolio_id}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() =>
                handleStatusUpdate(params.row.portfolio_id, "approved")
              }
            >
              <CheckCircle fontSize="small" sx={{ mr: 1 }} /> Approve
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleStatusUpdate(params.row.portfolio_id, "rejected")
              }
            >
              <Block fontSize="small" sx={{ mr: 1 }} /> Reject
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => handleDelete(params.row.portfolio_id)}
              sx={{ color: "error.main" }}
            >
              <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Portfolio
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Card
        sx={{
          p: 2,
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: "white",
          height: "85vh",
        }}
      >
        <CardContent sx={{ height: "100%" }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Manage Portfolios
          </Typography>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "70%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={portfolios}
              columns={columns}
              getRowId={(row) => row.portfolio_id}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              disableSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                "& .MuiDataGrid-columnHeaders": {
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedPortfolio && (
        <PortfolioDetailModal
          portfolio={selectedPortfolio}
          open={isViewOpen}
          onClose={() => setViewOpen(false)}
        />
      )}

      {/* Notifications */}
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
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Portfolios;