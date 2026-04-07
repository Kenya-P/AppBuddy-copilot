import { useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext.jsx";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";

function App() {
  const { loggedIn, loading, handleLogout } = useContext(AuthContext);

  return (
    <div>
      <nav className="nav-bar">
        <Link className="nav-bar__link" to="/">Home</Link>{" "}
        {!loggedIn ? (
          <div className="nav-bar__auth-links">
            <Link className="nav-bar__link" to="/login">Login</Link>{" "}
            <Link className="nav-bar__link" to="/register">Register</Link>
          </div>
        ) : (
          <button className="nav-bar__button" onClick={handleLogout}>Logout</button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;