import { useEffect, useState } from "react";
import "../../styles/admin.css";
import { fetchUsers } from "../../api/adminApi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h1 className="admin-page-title">Users</h1>
      <p className="admin-page-subtitle">
        View registered students, teachers, and admins.
      </p>

      <div className="admin-card">
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td>{u.email || "-"}</td>
                  <td>{u.phone || "-"}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
