// client/src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "../components/Layout/MainLayout";

// The landing page stays in the main bundle — it is the most-visited route and
// loading it eagerly means the first paint never waits on a second request.
import HomePage from "../pages/HomePage";

// Everything else is code-split, so the initial download only carries what the
// first screen actually needs.
const CoursesPage = lazy(() => import("../pages/CoursesPage"));
const CourseSubjectsPage = lazy(() => import("../pages/CourseSubjectsPage"));
const CourseChaptersPage = lazy(() => import("../pages/CourseChaptersPage"));
const ChapterContentOverviewPage = lazy(() => import("../pages/ChapterContentOverviewPage"));
const CourseContentPage = lazy(() => import("../pages/CourseContentPage"));
const QuizPage = lazy(() => import("../pages/QuizPage"));
const MyBadgesPage = lazy(() => import("../pages/MyBadgesPage"));
const ChallengesPage = lazy(() => import("../pages/ChallengesPage"));
const ChallengeQuizPage = lazy(() => import("../pages/ChallengeQuizPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));

function RouteFallback() {
  return (
    <div className="gs-route-fallback">
      <span className="gs-route-fallback__spinner" />
      <span>Loading…</span>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:classId" element={<CourseSubjectsPage />} />
            <Route
              path="/courses/:classId/:subjectId"
              element={<CourseChaptersPage />}
            />
            <Route
              path="/courses/:classId/:subjectId/:chapterId"
              element={<ChapterContentOverviewPage />}
            />
            <Route
              path="/courses/:classId/:subjectId/:chapterId/quiz"
              element={<QuizPage />}
            />
            <Route
              path="/courses/:classId/:subjectId/:chapterId/:contentType"
              element={<CourseContentPage />}
            />
            <Route path="/my-badges" element={<MyBadgesPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route
              path="/challenges/:cadence/:challengeId/quiz"
              element={<ChallengeQuizPage />}
            />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  );
}
