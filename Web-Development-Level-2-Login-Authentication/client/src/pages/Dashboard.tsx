
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="dashboard-brand">
          <span className="auth-logo">A</span>
          <span>AuthSystem</span>
        </div>

        <button className="logout-button" onClick={logout}>
          Sign Out
        </button>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-card">
          <div className="welcome-icon">✓</div>
          <h1>Welcome, {user?.name}!</h1>
          <p>You have successfully authenticated.</p>
        </div>

        <div className="profile-card">
          <h2>Your Profile</h2>

          <div className="profile-item">
            <span>Full Name</span>
            <strong>{user?.name}</strong>
          </div>

          <div className="profile-item">
            <span>Email Address</span>
            <strong>{user?.email}</strong>
          </div>

          <div className="profile-item">
            <span>Account ID</span>
            <strong>#{user?.id}</strong>
          </div>

          <div className="account-status">
            <span className="status-dot"></span>
            Authenticated
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
