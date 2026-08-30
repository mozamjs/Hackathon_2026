import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import ComplaintsListPage from '../pages/ComplaintsListPage';
import ComplaintDetailPage from '../pages/ComplaintDetailPage';
import NewComplaintPage from '../pages/NewComplaintPage';
import MyComplaintsPage from '../pages/MyComplaintsPage';
import OfficerDashboardPage from '../pages/officer/OfficerDashboardPage';
import OfficerComplaintDetailPage from '../pages/officer/OfficerComplaintDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/complaints" element={<ComplaintsListPage />} />
        <Route path="/complaints/:id" element={<ComplaintDetailPage />} />

        {/* Citizen Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <RoleRoute allowedRoles={['citizen']}>
              <DashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="/complaints/new"
          element={
            <RoleRoute allowedRoles={['citizen']}>
              <NewComplaintPage />
            </RoleRoute>
          }
        />
        <Route
          path="/complaints/mine"
          element={
            <RoleRoute allowedRoles={['citizen']}>
              <MyComplaintsPage />
            </RoleRoute>
          }
        />

        {/* Officer Protected Routes */}
        <Route
          path="/officer/dashboard"
          element={
            <RoleRoute allowedRoles={['officer']}>
              <OfficerDashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="/officer/complaints/:id"
          element={
            <RoleRoute allowedRoles={['officer']}>
              <OfficerComplaintDetailPage />
            </RoleRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
