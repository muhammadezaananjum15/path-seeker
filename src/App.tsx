import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout Shells
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Experience Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage';
import { VerifyOtpPage } from './pages/public/VerifyOtpPage';
import { ContactPage } from './pages/public/ContactPage';
import { SitemapPage } from './pages/public/SitemapPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { OnboardingWizardPage } from './pages/public/OnboardingWizardPage';

// User & Career Passport Pages
import { DashboardPage } from './pages/user/DashboardPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { CareersPage } from './pages/user/CareersPage';
import { CareerDetailPage } from './pages/user/CareerDetailPage';
import { QuizPage } from './pages/user/QuizPage';
import { QuizResultsPage } from './pages/user/QuizResultsPage';
import { MultimediaPage } from './pages/user/MultimediaPage';
import { VideoDetailPage } from './pages/user/VideoDetailPage';
import { StoriesPage } from './pages/user/StoriesPage';
import { StoryDetailPage } from './pages/user/StoryDetailPage';
import { SubmitStoryPage } from './pages/user/SubmitStoryPage';
import { ResourcesPage } from './pages/user/ResourcesPage';
import { BookmarksPage } from './pages/user/BookmarksPage';
import { FeedbackPage } from './pages/user/FeedbackPage';
import { NotificationsPage } from './pages/user/NotificationsPage';
import { AiConsolePage } from './pages/user/AiConsolePage';

// Admin Suite Management Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCareersPage } from './pages/admin/AdminCareersPage';
import { AdminMultimediaPage } from './pages/admin/AdminMultimediaPage';
import { AdminQuizPage } from './pages/admin/AdminQuizPage';
import { AdminStoriesPage } from './pages/admin/AdminStoriesPage';
import { AdminResourcesPage } from './pages/admin/AdminResourcesPage';
import { AdminFeedbackPage } from './pages/admin/AdminFeedbackPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* App Shell Layout (Navbar, Drawers, Search Palette, Modals, Toasts, Footer) */}
        <Route element={<AppLayout />}>
          {/* Public Portal Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/onboarding" element={<OnboardingWizardPage />} />

          {/* Public Discovery Routes */}
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:careerId" element={<CareerDetailPage />} />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/results"
            element={
              <ProtectedRoute>
                <QuizResultsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/multimedia" element={<MultimediaPage />} />
          <Route path="/multimedia/:mediaId" element={<VideoDetailPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/submit" element={<SubmitStoryPage />} />
          <Route path="/stories/:storyId" element={<StoryDetailPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />

          {/* Protected User Passport Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Control Suite Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="careers" element={<AdminCareersPage />} />
            <Route path="multimedia" element={<AdminMultimediaPage />} />
            <Route path="quiz" element={<AdminQuizPage />} />
            <Route path="success-stories" element={<AdminStoriesPage />} />
            <Route path="resources" element={<AdminResourcesPage />} />
            <Route path="feedback" element={<AdminFeedbackPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>

          {/* Fallback 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
