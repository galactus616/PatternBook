import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageLoader from "../components/ui/PageLoader";

// Admin
import AdminLayout from "../components/layout/AdminLayout";
import AuthGuard from "../components/layout/AuthGuard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TopicsPage from "../pages/admin/Topics";
import PatternsPage from "../pages/admin/Patterns";
import SubPatternsPage from "../pages/admin/SubPatterns";
import ProblemsAdminPage from "../pages/admin/Problems";
import UsersPage from "../pages/admin/Users";
import PaymentsPage from "../pages/admin/Payments";
import CouponsPage from "../pages/admin/Coupons";
import NotAuthorized from "../pages/NotAuthorized";
import { AdminProvider } from "../hooks/useAdmin";

// Lazy load user pages
const LandingPage     = lazy(() => import("../pages/LandingPage"));
const DashboardPage   = lazy(() => import("../pages/DashboardPage"));
const ProblemsPage    = lazy(() => import("../pages/ProblemsPage"));
const SettingsPage    = lazy(() => import("../pages/SettingsPage"));
const ProfilePage     = lazy(() => import("../pages/ProfilePage"));
const FriendsPage     = lazy(() => import("../pages/FriendsPage"));
const LeaderboardPage = lazy(() => import("../pages/LeaderboardPage"));

// Helper to wrap admin pages in AuthGuard, AdminProvider, and AdminLayout
const wrapAdmin = (Component) => (
  <AuthGuard requireAdminOrModerator>
    <AdminProvider>
      <AdminLayout>
        <Component />
      </AdminLayout>
    </AdminProvider>
  </AuthGuard>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ── Public ── */}
          <Route path="/" element={<LandingPage />} />

          {/* ── User Dashboard ── */}
          <Route path="/dashboard"  element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/problems"   element={<ProtectedRoute><DashboardLayout><ProblemsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/leaderboard"element={<ProtectedRoute><DashboardLayout><LeaderboardPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/settings"   element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/profile"    element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/friends"    element={<ProtectedRoute><DashboardLayout><FriendsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/u/:userId"  element={<ProtectedRoute><DashboardLayout><ProfilePage isPublic /></DashboardLayout></ProtectedRoute>} />

          {/* ── Admin Routes ── */}
          <Route path="/admin"            element={wrapAdmin(AdminDashboard)}   />
          <Route path="/admin/topics"     element={wrapAdmin(TopicsPage)}       />
          <Route path="/admin/patterns"   element={wrapAdmin(PatternsPage)}     />
          <Route path="/admin/sub-patterns" element={wrapAdmin(SubPatternsPage)}/>
          <Route path="/admin/problems"   element={wrapAdmin(ProblemsAdminPage)}/>
          <Route path="/admin/users"      element={wrapAdmin(UsersPage)}        />
          <Route path="/admin/payments"   element={wrapAdmin(PaymentsPage)}     />
          <Route path="/admin/coupons"    element={wrapAdmin(CouponsPage)}      />

          {/* ── Fallback ── */}
          <Route path="/not-authorized" element={<NotAuthorized />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;