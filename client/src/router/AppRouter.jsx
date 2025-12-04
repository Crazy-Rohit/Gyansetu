// client/src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/Layout/MainLayout";

import HomePage from "../pages/HomePage";
import CoursesPage from "../pages/CoursesPage";
import CourseSubjectsPage from "../pages/CourseSubjectsPage";
import CourseChaptersPage from "../pages/CourseChaptersPage";
import ChapterContentOverviewPage from "../pages/ChapterContentOverviewPage";
import CourseContentPage from "../pages/CourseContentPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import AdminLayout from "../components/Layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminClasses from "../pages/admin/AdminClasses";
import AdminSubjects from "../pages/admin/AdminSubjects";
import AdminChapters from "../pages/admin/AdminChapters";
import AdminContent from "../pages/admin/AdminContent";
import AdminUsers from "../pages/admin/AdminUsers";

import { ProtectedRoute, AdminRoute } from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Courses – login required */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            }
          />

          {/* Class → Subjects */}
          <Route
            path="/courses/:classId"
            element={
              <ProtectedRoute>
                <CourseSubjectsPage />
              </ProtectedRoute>
            }
          />

          {/* Subject → Chapters */}
          <Route
            path="/courses/:classId/:subjectId"
            element={
              <ProtectedRoute>
                <CourseChaptersPage />
              </ProtectedRoute>
            }
          />

          {/* Chapter → Sub-content types (Lectures / Notes / Tests / Books) */}
          <Route
            path="/courses/:classId/:subjectId/:chapterId"
            element={
              <ProtectedRoute>
                <ChapterContentOverviewPage />
              </ProtectedRoute>
            }
          />

          {/* Specific sub-content type page (only lectures / only notes etc.) */}
          <Route
            path="/courses/:classId/:subjectId/:chapterId/:contentType"
            element={
              <ProtectedRoute>
                <CourseContentPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes – admin only */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/classes"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminClasses />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/subjects"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminSubjects />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/chapters"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminChapters />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/content"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminContent />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </AdminRoute>
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
