// src/pages/Accounts.jsx
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
import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Visibility,
  Delete,
  MoreVert,
  CheckCircle,
  Block,
  Gavel,
  PauseCircle,
} from "@mui/icons-material";

import { fetchUsers } from "../services/api"; // 🔹 use your service
import api from "../services/api"; // 🔹 for PUT/DELETE
import UserDetailModal from "../components/UserDetailModal";

const getStatusChip = (params) => {
  const status = params.value;
  const colorMap = {
    pending: "warning",
    approved: "success",
    rejected: "error",
    banned: "default",
    hold: "info",
  };
  return (
    <Chip
      label={status.toUpperCase()}
      color={colorMap[status] || "default"}
      size="small"
      sx={{ fontWeight: "bold", minWidth: 85 }}
    />
  );
};

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewOpen, setViewOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isMobile = useMediaQuery("(max-width:768px)");

  // ✅ Fetch users with service
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers(1, 100); // API call
      console.log("API response:", data);
  
      setUsers(
        (data?.users || []).map((u) => ({
          ...u,
          name: `${u.profile?.first_name || ""} ${u.profile?.last_name || ""}`,
        }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      setNotification({
        open: true,
        message: "Failed to fetch users",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    loadUsers();
  }, []);

  const handleMenuClick = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setActiveMenuId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenuId(null);
  };

  // ✅ Update status with api instance
  const handleStatusUpdate = async (userId, status) => {
    try {
      await api.put(`/account/update-status/${userId}`, { status }); // 🔹 adjust endpoint if needed
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status } : user
        )
      );
      setNotification({
        open: true,
        message: `User status updated to ${status}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      setNotification({
        open: true,
        message: "Failed to update status",
        severity: "error",
      });
    }
    handleMenuClose();
  };

  // ✅ Delete user
  const handleDelete = async (userId) => {
    try {
      await api.delete(`/account/delete/${userId}`); // 🔹 adjust endpoint if needed
      setUsers(users.filter((user) => user.id !== userId));
      setNotification({
        open: true,
        message: "User deleted successfully",
        severity: "warning",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setNotification({
        open: true,
        message: "Failed to delete user",
        severity: "error",
      });
    }
    handleMenuClose();
  };

  const handleView = (user) => {
    setSelectedUser(users.find((u) => u.id === user.id));
    setViewOpen(true);
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: getStatusChip,
    },
    {
      field: "created_at",
      headerName: "Date Joined",
      type: "date",
      width: 150,
      valueGetter: (params) => new Date(params.value),
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
              onClick={(e) => handleMenuClick(e, params.row.id)}
            >
              <MoreVert />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && activeMenuId === params.row.id}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleStatusUpdate(params.row.id, "approved")}>
              <CheckCircle fontSize="small" sx={{ mr: 1 }} /> Approve
            </MenuItem>
            <MenuItem onClick={() => handleStatusUpdate(params.row.id, "rejected")}>
              <Block fontSize="small" sx={{ mr: 1 }} /> Reject
            </MenuItem>
            <MenuItem onClick={() => handleStatusUpdate(params.row.id, "banned")}>
              <Gavel fontSize="small" sx={{ mr: 1 }} /> Ban
            </MenuItem>
            <MenuItem onClick={() => handleStatusUpdate(params.row.id, "hold")}>
              <PauseCircle fontSize="small" sx={{ mr: 1 }} /> Hold
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => handleDelete(params.row.id)}
              sx={{ color: "error.main" }}
            >
              <Delete fontSize="small" sx={{ mr: 1 }} /> Delete User
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
            Manage Accounts
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={users}
              columns={columns}
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

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
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
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Accounts;
