import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BrowseItemsPage from './pages/BrowseItemsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MyPostsPage from './pages/MyPostsPage';
import ReportItemPage from './pages/ReportItemPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import AdminLogsPage from './pages/AdminLogsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/browse" element={<BrowseItemsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/report/lost"
          element={
            <ProtectedRoute>
              <ReportItemPage mode="LOST" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report/found"
          element={
            <ProtectedRoute>
              <ReportItemPage mode="FOUND" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-posts"
          element={
            <ProtectedRoute>
              <MyPostsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/items/:id" element={<ItemDetailsPage />} />
        <Route
          path="/admin/login-logs"
          element={
            <AdminRoute>
              <AdminLogsPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
