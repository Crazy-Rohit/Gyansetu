// client/src/pages/QuizPage.jsx
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/course.css";
import "../styles/quiz.css";
import "../styles/quizThemes.css";
import {
  getClassById,
  getSubjectById,
  getChapterById,
} from "../data/coursesData";
import { getQuizForChapter } from "../data/quizData";
import { getChapterProgress, recordLevelResult } from "../utils/quizProgress";
import { getChapterQuizTheme } from "../utils/quizTheme";
import QuizRunner from "../components/QuizRunner";
import ComingSoon from "../components/ComingSoon";

export default function QuizPage() {
  const { classId, subjectId, chapterId } = useParams();

  const clazz = getClassById(classId);
  const subject = getSubjectById(classId, subjectId);
  const chapter = getChapterById(classId, subjectId, chapterId);
  const quiz = getQuizForChapter(classId, subjectId, chapterId);

  const [progress] = useState(() => getChapterProgress(classId, subjectId, chapterId));

  const breadcrumbTitle = () => {
    const parts = [];
    if (clazz) parts.push(clazz.name);
    if (subject) parts.push(subject.name);
    if (chapter) parts.push(chapter.title);
    return parts.join(" › ");
  };

  return (
    <section className={`courses-page ${getChapterQuizTheme(classId, chapterId)}`}>
      <div className="gs-container">
        <Breadcrumb classId={classId} subjectId={subjectId} chapter={chapter} clazz={clazz} subject={subject} />

        {!quiz ? (
          <>
            <h1 className="course-title">{breadcrumbTitle()} – Quiz</h1>
            <ComingSoon
              text={`We're still preparing the interactive quiz for ${chapter?.title || "this chapter"}. Check back soon — it'll have 5 levels, a timer on every question, and a badge for each one you pass.`}
              cta={
                <Link
                  to={`/courses/${classId}/${subjectId}/${chapterId}`}
                  className="gs-btn quiz-btn-secondary"
                >
                  Back to Chapter
                </Link>
              }
            />
          </>
        ) : (
          <QuizRunner
            quiz={quiz}
            progress={progress}
            badgeIdBase={chapterId}
            onFinishLevel={(level, outcome) =>
              recordLevelResult(classId, subjectId, chapterId, level, outcome)
            }
          />
        )}
      </div>
    </section>
  );
}

function Breadcrumb({ classId, subjectId, chapter, clazz, subject }) {
  return (
    <nav className="breadcrumb">
      <Link to="/courses" className="breadcrumb-link">
        Courses
      </Link>
      {clazz && (
        <>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/courses/${classId}`} className="breadcrumb-link breadcrumb-strong">
            {clazz.name}
          </Link>
        </>
      )}
      {subject && (
        <>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/courses/${classId}/${subjectId}`} className="breadcrumb-link breadcrumb-strong">
            {subject.name}
          </Link>
        </>
      )}
      {chapter && (
        <>
          <span className="breadcrumb-sep">›</span>
          <Link
            to={`/courses/${classId}/${subjectId}/${chapter.id}`}
            className="breadcrumb-link breadcrumb-strong"
          >
            {chapter.title}
          </Link>
        </>
      )}
      <span className="breadcrumb-sep">›</span>
      <span className="breadcrumb-current">Quiz</span>
    </nav>
  );
}
