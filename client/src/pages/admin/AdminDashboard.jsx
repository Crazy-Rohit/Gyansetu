import "../..//styles/admin.css";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="admin-page-title">Admin Dashboard</h1>
      <p className="admin-page-subtitle">
        Manage classes, subjects, chapters, and content for Gyan Setu.
      </p>

      <div className="admin-card">
        <p>
          Start by adding <strong>Classes</strong> (e.g., Class 9, Class 10),
          then <strong>Subjects</strong> (Mathematics), then <strong>Chapters</strong>,
          and finally add <strong>Lectures / Notes / Tests / Books</strong> under each chapter.
        </p>
      </div>
    </div>
  );
}
