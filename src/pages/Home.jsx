import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  Box,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import StatCard from "../components/StatCard";
import { People, Collections, CheckCircle, HourglassEmpty } from "@mui/icons-material";
import { fetchUsers, fetchPortfolios } from "../services/api";

// --- Temporary dummy data for charts (API not ready yet) ---
const userSignupData = [
  { month: "Jan", users: 20 },
  { month: "Feb", users: 35 },
  { month: "Mar", users: 40 },
  { month: "Apr", users: 30 },
  { month: "May", users: 25 },
  { month: "Jun", users: 45 },
  { month: "Jul", users: 38 },
  { month: "Aug", users: 50 },
  { month: "Sep", users: 28 },
  { month: "Oct", users: 42 },
  { month: "Nov", users: 36 },
  { month: "Dec", users: 48 },
];

const portfolioTrendData = [
  { month: "Jan", approved: 10, pending: 5, rejected: 2 },
  { month: "Feb", approved: 12, pending: 7, rejected: 1 },
  { month: "Mar", approved: 15, pending: 6, rejected: 3 },
  { month: "Apr", approved: 20, pending: 4, rejected: 2 },
  { month: "May", approved: 18, pending: 8, rejected: 3 },
  { month: "Jun", approved: 22, pending: 5, rejected: 2 },
  { month: "Jul", approved: 25, pending: 7, rejected: 1 },
  { month: "Aug", approved: 30, pending: 6, rejected: 2 },
  { month: "Sep", approved: 28, pending: 5, rejected: 4 },
  { month: "Oct", approved: 32, pending: 4, rejected: 3 },
  { month: "Nov", approved: 35, pending: 6, rejected: 2 },
  { month: "Dec", approved: 40, pending: 7, rejected: 1 },
];

const Home = () => {
  const [users, setUsers] = useState(null);
  const [portfolios, setPortfolios] = useState(null);
  const [loading, setLoading] = useState(true);

  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, portfoliosRes] = await Promise.all([
          fetchUsers(1, 100),
          fetchPortfolios(1, 100),
        ]);
        setUsers(usersRes);
        setPortfolios(portfoliosRes);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalUsers = users?.total || 0;
  const totalPortfolios = portfolios?.pagination?.total || 0;

  const approvedPortfolios =
    portfolios?.data?.filter((p) => p.status === "approved").length || 0;
  const pendingPortfolios =
    portfolios?.data?.filter((p) => p.status === "pending").length || 0;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Dashboard Title */}
      <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", mb: 3 }}>
        Dashboard
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={totalUsers}
            icon={<People color="primary" sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Portfolios" value={totalPortfolios}
            icon={<Collections color="secondary" sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Approved Portfolios" value={approvedPortfolios}
            icon={<CheckCircle color="success" sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Portfolios" value={pendingPortfolios}
            icon={<HourglassEmpty color="warning" sx={{ fontSize: 40 }} />} />
        </Grid>
      </Grid>

      {/* Bar Chart - User Signups */}
      <Paper sx={{ p: 3, mb: 4, height: 500, borderRadius: 3, boxShadow: 4, width: "100%" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
          User Signups (Yearly)
        </Typography>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={userSignupData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Line Chart - Portfolio Trends */}
      <Paper sx={{ p: 3, mb: 4, height: 500, borderRadius: 3, boxShadow: 4, width: "100%" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
          Portfolio Trends (Yearly)
        </Typography>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={portfolioTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="approved" stroke="#4caf50" strokeWidth={2} />
            <Line type="monotone" dataKey="pending" stroke="#ff9800" strokeWidth={2} />
            <Line type="monotone" dataKey="rejected" stroke="#f44336" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default Home;
