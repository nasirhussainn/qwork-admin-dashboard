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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "../components/StatCard";
import { 
  People, 
  Collections, 
  CheckCircle, 
  HourglassEmpty,
  TrendingUp,
  Analytics,
  Assessment,
  Timeline
} from "@mui/icons-material";
import { fetchUsers, fetchPortfolios } from "../services/api";

// Enhanced dummy data with more realistic values
const userSignupData = [
  { month: "Jan", users: 85, growth: 12 },
  { month: "Feb", users: 120, growth: 18 },
  { month: "Mar", users: 145, growth: 22 },
  { month: "Apr", users: 132, growth: 15 },
  { month: "May", users: 178, growth: 28 },
  { month: "Jun", users: 205, growth: 35 },
  { month: "Jul", users: 198, growth: 32 },
  { month: "Aug", users: 245, growth: 42 },
  { month: "Sep", users: 228, growth: 38 },
  { month: "Oct", users: 275, growth: 48 },
  { month: "Nov", users: 295, growth: 52 },
  { month: "Dec", users: 320, growth: 58 },
];

const portfolioTrendData = [
  { month: "Jan", approved: 45, pending: 15, rejected: 8 },
  { month: "Feb", approved: 52, pending: 18, rejected: 6 },
  { month: "Mar", approved: 68, pending: 22, rejected: 10 },
  { month: "Apr", approved: 78, pending: 16, rejected: 7 },
  { month: "May", approved: 85, pending: 25, rejected: 12 },
  { month: "Jun", approved: 95, pending: 20, rejected: 8 },
  { month: "Jul", approved: 105, pending: 28, rejected: 9 },
  { month: "Aug", approved: 125, pending: 22, rejected: 11 },
  { month: "Sep", approved: 118, pending: 19, rejected: 15 },
  { month: "Oct", approved: 142, pending: 24, rejected: 13 },
  { month: "Nov", approved: 155, pending: 26, rejected: 10 },
  { month: "Dec", approved: 168, pending: 30, rejected: 8 },
];

const statusDistributionData = [
  { name: "Approved", value: 168, color: "#10b981" },
  { name: "Pending", value: 30, color: "#f59e0b" },
  { name: "Rejected", value: 8, color: "#ef4444" },
];

const Home = () => {
  const [users, setUsers] = useState(null);
  const [portfolios, setPortfolios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoaded, setStatsLoaded] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");
  const theme = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, portfoliosRes] = await Promise.all([
          fetchUsers(1, 100),
          fetchPortfolios(1, 100),
        ]);
        setUsers(usersRes);
        setPortfolios(portfoliosRes);
        
        // Simulate stats loading with delay for animation
        setTimeout(() => setStatsLoaded(true), 300);
      } catch (err) {
        console.error("Error fetching data:", err);
        setTimeout(() => setStatsLoaded(true), 300);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  const totalUsers = users?.total || 0;
  const totalPortfolios = portfolios?.pagination?.total || 0;
  const approvedPortfolios = portfolios?.data?.filter((p) => p.status === "approved").length || 0;
  const pendingPortfolios = portfolios?.data?.filter((p) => p.status === "pending").length || 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 2,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 2,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color, fontWeight: 600 }}
            >
              {`${entry.name}: ${entry.value}`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Welcome Header */}
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
                  Welcome to Q-Work Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  Monitor your platform's performance and user engagement
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
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
                <Analytics sx={{ fontSize: 60, opacity: 0.9 }} />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Enhanced Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: "Total Users",
            value: totalUsers,
            icon: <People sx={{ fontSize: 40 }} />,
            color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            change: "+12%",
            delay: 100
          },
          {
            title: "Total Portfolios",
            value: totalPortfolios,
            icon: <Collections sx={{ fontSize: 40 }} />,
            color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            change: "+8%",
            delay: 200
          },
          {
            title: "Approved Portfolios",
            value: approvedPortfolios,
            icon: <CheckCircle sx={{ fontSize: 40 }} />,
            color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            change: "+15%",
            delay: 300
          },
          {
            title: "Pending Portfolios",
            value: pendingPortfolios,
            icon: <HourglassEmpty sx={{ fontSize: 40 }} />,
            color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            change: "-5%",
            delay: 400
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Grow in={statsLoaded} timeout={stat.delay}>
              <Card
                sx={{
                  background: stat.color,
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
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {stat.value.toLocaleString()}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 600 }}>
                        {stat.title}
                      </Typography>
                      <Chip
                        label={stat.change}
                        size="small"
                        sx={{
                          mt: 1,
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Box sx={{ opacity: 0.8 }}>
                      {stat.icon}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4}>
        {/* User Signups Chart */}
        <Grid item xs={12} lg={8}>
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
                  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <TrendingUp />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    User Growth Trends
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Monthly user registration statistics for 2024
                  </Typography>
                </Box>
              </Stack>
              
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userSignupData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis 
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="users" 
                      fill="url(#userGradient)" 
                      radius={[6, 6, 0, 0]}
                      strokeWidth={0}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Fade>
        </Grid>

        {/* Portfolio Status Distribution */}
        <Grid item xs={12} lg={4}>
          <Fade in timeout={1200}>
            <Paper 
              sx={{ 
                p: 4, 
                borderRadius: 4, 
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.05)",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(20px)",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                  }}
                >
                  <Assessment />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    Portfolio Status
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Current distribution
                  </Typography>
                </Box>
              </Stack>
              
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              
              <Stack spacing={1} sx={{ mt: 2 }}>
                {statusDistributionData.map((item, index) => (
                  <Stack key={index} direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: item.color,
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1, color: "#64748b" }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                      {item.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Fade>
        </Grid>

        {/* Portfolio Trends Line Chart */}
        <Grid item xs={12}>
          <Fade in timeout={1400}>
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
                  background: "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)",
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "white",
                  }}
                >
                  <Timeline />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    Portfolio Submission Trends
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Track approval, pending, and rejection rates over time
                  </Typography>
                </Box>
              </Stack>
              
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis 
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="approved" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pending" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rejected" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;