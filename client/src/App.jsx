import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ProfilePage from './pages/ProfilePage';
import TimelinePortfolio from './pages/TimelinePortfolio';
import ResumeBuilder from './pages/ResumeBuilder';
import AIHub from './pages/AIHub';
import JobTracker from './pages/JobTracker';
import DocumentLocker from './pages/DocumentLocker';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Achievements from './pages/Achievements';
import CoverLetterGenerator from './pages/CoverLetterGenerator';
import CalendarPage from './pages/CalendarPage';
import NotesPage from './pages/NotesPage';


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFA] dark:bg-[#09090B]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="timeline" element={<TimelinePortfolio />} />
        <Route path="resume" element={<ResumeBuilder />} />
        <Route path="ai" element={<AIHub />} />
        <Route path="jobs" element={<JobTracker />} />
        <Route path="documents" element={<DocumentLocker />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="cover-letter" element={<CoverLetterGenerator />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="notes" element={<NotesPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
