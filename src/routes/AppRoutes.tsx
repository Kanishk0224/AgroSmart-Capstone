import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppLayout } from '../components/layout/AppLayout';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { FarmsPage } from '../pages/FarmsPage';
import { FarmDetailsPage } from '../pages/FarmDetailsPage';
import { SoilTestsPage } from '../pages/SoilTestsPage';
import { CropRecommendationsPage } from '../pages/CropRecommendationsPage';
import { WaterManagementPage } from '../pages/WaterManagementPage';
import { CropRotationPage } from '../pages/CropRotationPage';
import { ProfitabilityPage } from '../pages/ProfitabilityPage';
import { CropsCatalogPage } from '../pages/CropsCatalogPage';
import { FarmingPlansPage } from '../pages/FarmingPlansPage';
import { WeatherAdvisoryPage } from '../pages/WeatherAdvisoryPage';
import { ReportsPage } from '../pages/ReportsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500">Checking credentials...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated Dashboard Pages wrapped in AppLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FarmsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms/:farmId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FarmDetailsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/soil-tests"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SoilTestsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CropRecommendationsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/water-budget"
        element={
          <ProtectedRoute>
            <AppLayout>
              <WaterManagementPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crop-rotation"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CropRotationPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profitability"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfitabilityPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crops"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CropsCatalogPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farming-plans"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FarmingPlansPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/weather-advisory"
        element={
          <ProtectedRoute>
            <AppLayout>
              <WeatherAdvisoryPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
