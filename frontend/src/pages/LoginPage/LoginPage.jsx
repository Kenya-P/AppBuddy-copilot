import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as auth from "../../services/auth.js";
import { AuthContext } from "../../contexts/AuthContext.jsx";

function LoginPage() {
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { token } = await auth.login(formData);
      const user = await auth.getCurrentUser(token);
      handleLogin(user, token);
      navigate("/dashboard");
    } catch (err) {
      setError(typeof err === "string" ? err : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1 className="login-form__title">Login</h1>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit" className="login-form__button">Log In</button>
      {error && <p className="login-form__error">{error}</p>}
    </form>
  );
}

export default LoginPage;