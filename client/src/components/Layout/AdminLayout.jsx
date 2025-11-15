import { NavLink } from "react-router-dom";
import "../../styles/admin-layout.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin</h2>
          <p>Gyan Setu</p>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/classes">Classes</NavLink>
          <NavLink to="/admin/subjects">Subjects</NavLink>
          <NavLink to="/admin/chapters">Chapters</NavLink>
          <NavLink to="/admin/content">Content</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
        </nav>
      </aside>
      <section className="admin-main">
        {children}
      </section>
    </div>
  );
}
