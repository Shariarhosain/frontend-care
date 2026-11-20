import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <NavLink to="/notes" className="brand">
            <span className="brand-logo">SN</span>
            <span>SecureNotes</span>
          </NavLink>

          <nav className="nav-links">
            <NavLink to="/notes" end>
              My Notes
            </NavLink>
            <NavLink to={`/users/${user._id}/posts`}>My Posts</NavLink>
            <NavLink to="/interests">Interests</NavLink>
            {user.role === 'admin' && (
              <>
                <span className="nav-divider" />
                <NavLink to="/admin/users">Users</NavLink>
                <NavLink to="/admin/notes">All Notes</NavLink>
              </>
            )}
          </nav>

          <div className="nav-user">
            <NavLink to="/profile" className="nav-profile">
              <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
              <span className="nav-user-name">{user.name}</span>
              <span className={`badge badge-${user.role}`}>{user.role}</span>
            </NavLink>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
