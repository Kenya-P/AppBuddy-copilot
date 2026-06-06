import { useContext, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext.jsx";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import NewApplicationModal from "./components/NewApplicationModal/NewApplicationModal.jsx";
import ApplicationsPage from "./pages/ApplicationPage/ApplicationPage.jsx";
import ApplicationDetailPage from "./pages/ApplicationDetailPage/ApplicationDetailPage.jsx";
import ResumeUploadPage from "./pages/ResumeUploadPage/ResumeUploadPage.jsx";
import GapAnalysisPage from "./pages/GapAnalysisPage.jsx";

import * as auth from "./services/auth.js";

function App() {
  const navigate = useNavigate();
  const { loggedIn, loading, handleLogout, handleLogin } = useContext(AuthContext);

  const [activeModal, setActiveModal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openLoginModal = () => setActiveModal("login");
  const openRegisterModal = () => setActiveModal("register");
  const closeActiveModal = () => setActiveModal("");

  const handleUserLogin = async (formData) => {
    setIsLoading(true);
    try {
      const { token } = await auth.login(formData);
      const user = await auth.getCurrentUser(token);
      handleLogin(user, token);
      closeActiveModal();
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserRegister = async (formData) => {
    setIsLoading(true);
    try {
      await auth.register(formData);
      closeActiveModal();
      openLoginModal();
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <nav className="nav-bar">
      <Link className="nav-bar__logo" to="/">AppBuddy</Link>

      {loggedIn && (
        <div className="nav-bar__links">
          <Link className="nav-bar__link" to="/dashboard">Dashboard</Link>
          <Link className="nav-bar__link" to="/applications">Applications</Link>
          <Link className="nav-bar__link" to="/resume">Resume</Link>
          <Link className="nav-bar__link" to="/analysis">Analyze Job</Link>
          <Link className="nav-bar__link" to="/profile">Profile</Link>
        </div>
      )}

      <div className="nav-bar__btns">
        {!loggedIn ? (
          <>
            <button className="nav-bar__btn" type="button" onClick={openLoginModal}>Login</button>
            <button className="nav-bar__btn" type="button" onClick={openRegisterModal}>Register</button>
          </>
        ) : (
          <button className="nav-bar__btn" type="button" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <ApplicationDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <ResumeUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <GapAnalysisPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <LoginPage
        isOpen={activeModal === "login"}
        onClose={closeActiveModal}
        onLogin={handleUserLogin}
        isLoading={isLoading}
        onClickRegister={() => setActiveModal("register")}
      />

      <RegisterPage
        isOpen={activeModal === "register"}
        onClose={closeActiveModal}
        onRegister={handleUserRegister}
        isLoading={isLoading}
        onClickLogin={() => setActiveModal("login")}
      />
    </div>
  );
}

export default App;