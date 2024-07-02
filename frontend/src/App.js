// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar/Navbar';
import HomePage from './pages/Home/Home';
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ManageLocationsPage from './pages/Locations/ManageLocationsPage';
import ManageItems from './pages/Items/ManageItemsPage';
import ManageRulesPage from './pages/Rules/ManageRulesPage';
import DetectionOptionsPage from './pages/DetectionOptions/DetectionOptionsPage';
import NormalDetectionPage from './pages/NormalDetection/NormalDetectionPage';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import UserProfile from './pages/UserProfile/UserProfile';
import VideoDetectionPage from './pages/Video/VideoDetectionPage';

import Error500 from './pages/Error/Error500/Error500';
import ProtectedRoute from './firewall/ProtectedRoute';
import RouteProtection from './firewall/RouteProtection';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== '/error-500' && <Navbar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<RouteProtection redirectTo="/" />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route path="/register" element={<RouteProtection redirectTo="/" />}>
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route path="/admin/login" element={<RouteProtection redirectTo="/admin/dashboard" />}>
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Route>
          <Route path="/admin/dashboard" element={
            <ProtectedRoute isAdminRoute={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute isAdminRoute={true}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage-items" element={
            <ProtectedRoute isAdminRoute={true}>
              <ManageItems />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage-locations" element={
            <ProtectedRoute isAdminRoute={true}>
              <ManageLocationsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage-rules" element={
            <ProtectedRoute isAdminRoute={true}>
              <ManageRulesPage />
            </ProtectedRoute>
          } />
          <Route path="/detection-options" element={
            <ProtectedRoute>
              <DetectionOptionsPage />
            </ProtectedRoute>
          } />
          <Route path="/normal-detection" element={
            <ProtectedRoute>
              <NormalDetectionPage />
            </ProtectedRoute>
          } />
          <Route path="/user/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/user/manage-rules" element={
            <ProtectedRoute>
              <ManageRulesPage />
            </ProtectedRoute>
          } />
          <Route path="/upload-video" element={
            <ProtectedRoute>
              <VideoDetectionPage />
            </ProtectedRoute>
          } />
          <Route path="/error-500" element={<Error500 />} />
          <Route path="*" element={<HomePage />} /> {/* Catch-all route */}
        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
