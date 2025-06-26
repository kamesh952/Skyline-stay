import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './styles';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/Dashboard';
import GuestsPage from './pages/GuestsPage';
import RoomsPage from './pages/RoomsPage';
import BookingsPage from './pages/BookingsPage';
import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes with layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>  {/* Layout wraps all protected routes */}
                <Route index element={<DashboardPage />} />  {/* This handles the / path */}
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/guests" element={<GuestsPage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
              </Route>
            </Route>
            
            {/* Redirects */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;