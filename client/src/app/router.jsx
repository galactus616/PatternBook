import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageLoader from "../components/ui/PageLoader";

// Lazy load pages
const LandingPage = lazy(() => import("../pages/LandingPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ProblemsPage = lazy(() => import("../pages/ProblemsPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const FriendsPage = lazy(() => import("../pages/FriendsPage"));

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/problems"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProblemsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FriendsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/u/:userId"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProfilePage isPublic />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;