import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Portfolios from './pages/Portfolios';
import Login from './pages/Login';
import AdminProfile from './pages/AdminProfile'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

// Auth Route Component (redirects to home if already logged in)
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (token) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Login Route - redirects to home if already authenticated */}
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } 
      />
      
      {/* Protected Dashboard Routes */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/accounts" 
        element={
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/portfolios" 
        element={
          <ProtectedRoute>
            <Portfolios />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-profile" 
        element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        } 
      />
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Catch all route - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;