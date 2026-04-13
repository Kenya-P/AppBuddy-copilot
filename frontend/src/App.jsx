import { useContext, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext.jsx";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
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
    <div>
      <nav className="nav-bar">
        <Link className="nav-bar__link" to="/">Home</Link>

        {!loggedIn ? (
          <div className="nav-bar__auth-links">
            <button type="button" className="nav-bar__button" onClick={openLoginModal}>
              Login
            </button>
            <button type="button" className="nav-bar__button" onClick={openRegisterModal}>
              Register
            </button>
          </div>
        ) : (
          <button className="nav-bar__button" onClick={handleLogout}>
            Logout
          </button>
        )}
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