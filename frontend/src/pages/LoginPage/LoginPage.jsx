import { useEffect } from "react";
import ModalWithForm from "../../components/ModalWithForm/ModalWithForm.jsx";
import { useFormAndValidation } from "../../utils/useFormAndValidation.js";

function LoginPage({ isOpen, onClose, onLogin, isLoading, onClickRegister }) {
  const { values, handleChange, errors, resetForm } =
    useFormAndValidation({
      email: "",
      password: "",
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(values);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <ModalWithForm
      buttonText={isLoading ? "Saving..." : "Login"}
      title="Sign in"
      name="login"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      secondaryButtonText="or Sign up"
      secondaryButtonAction={onClickRegister}
    >
      <label htmlFor="login-email" className="modal__label">
        Email
        <input
          id="login-email"
          name="email"
          type="email"
          className="modal__input"
          placeholder="Email"
          required
          onChange={handleChange}
          value={values.email || ""}
        />
        <span className="modal__input-error">{errors.email}</span>
      </label>

      <label htmlFor="login-password" className="modal__label">
        Password
        <input
          id="login-password"
          name="password"
          type="password"
          className="modal__input"
          placeholder="Password"
          required
          minLength="8"
          maxLength="20"
          onChange={handleChange}
          value={values.password || ""}
        />
        <span className="modal__input-error">{errors.password}</span>
      </label>
    </ModalWithForm>
  );
}

export default LoginPage;