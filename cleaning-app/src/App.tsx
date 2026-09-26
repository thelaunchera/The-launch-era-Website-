import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BusinessProvider, useBusiness } from "./context/BusinessContext";
import LoadingScreen from "./components/LoadingScreen";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OnboardingPage from "./pages/OnboardingPage";
import TodayPage from "./pages/TodayPage";
import ClientsPage from "./pages/ClientsPage";
import LeadsPage from "./pages/LeadsPage";
import ServicesPage from "./pages/ServicesPage";
import SettingsPage from "./pages/SettingsPage";
import PlaceholderPage from "./pages/PlaceholderPage";

function AuthGate() {
  const { session, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function WorkspaceGate() {
  const { business, loading } = useBusiness();
  if (loading) return <LoadingScreen />;
  if (!business) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<AuthGate />}>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route element={<WorkspaceGate />}>
          <Route path="/" element={<TodayPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/calendar" element={<PlaceholderPage kind="calendar" />} />
          <Route path="/quotes" element={<PlaceholderPage kind="quotes" />} />
          <Route path="/invoices" element={<PlaceholderPage kind="invoices" />} />
          <Route path="/team" element={<PlaceholderPage kind="team" />} />
          <Route path="/reports" element={<PlaceholderPage kind="reports" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <AppRoutes />
      </BusinessProvider>
    </AuthProvider>
  );
}
