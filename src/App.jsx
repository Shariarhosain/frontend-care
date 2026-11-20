import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import NoteDetail from './pages/NoteDetail';
import UserPosts from './pages/UserPosts';
import Interests from './pages/Interests';
import Profile from './pages/Profile';
import Users from './pages/admin/Users';
import AllNotes from './pages/admin/AllNotes';

function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card center">
        <h1>404</h1>
        <p className="muted">This page doesn&apos;t exist.</p>
        <Link to="/" className="btn btn-primary">
          Go home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* Logged-in area */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/notes" replace />} />
            <Route path="notes" element={<Notes />} />
            <Route path="notes/:id" element={<NoteDetail />} />
            <Route path="users/:id/posts" element={<UserPosts />} />
            <Route path="interests" element={<Interests />} />
            <Route path="profile" element={<Profile />} />

            {/* Admin only */}
            <Route path="admin/users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
            <Route path="admin/notes" element={<ProtectedRoute role="admin"><AllNotes /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
