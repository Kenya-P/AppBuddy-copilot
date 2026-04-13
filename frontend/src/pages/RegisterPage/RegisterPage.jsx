import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";
import { useFormAndValidation } from "../../utils/useFormAndValidation.js";

function RegisterPage({ isOpen, onClose, onRegister, isLoading, onClickLogin }) {
  const {
    values,
    handleChange,
    errors,
    resetForm,
  } = useFormAndValidation({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  return (
    <ModalWithForm
      buttonText={isLoading ? "Saving..." : "Sign Up"}
      title="Sign up"
      name="register"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={(e) => {
        e.preventDefault();
        onRegister(values);
      }}
      secondaryButtonText="or Log in"
      secondaryButtonAction={onClickLogin}
    >
      <label htmlFor="register-email" className="modal__label">
        Email
        <input
          id="register-email"
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

      <label htmlFor="register-password" className="modal__label">
        Password
        <input
          id="register-password"
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

      <label htmlFor="register-name" className="modal__label">
        Name
        <input
          id="register-name"
          type="text"
          name="name"
          className="modal__input"
          placeholder="Name"
          value={values.name || ""}
          onChange={handleChange}
          required
        />
        <span className="modal__input-error">{errors.name}</span>
      </label>

      <label htmlFor="register-avatar" className="modal__label">
        Avatar
        <input
          id="register-avatar"
          name="avatar"
          type="url"
          className="modal__input"
          placeholder="Avatar URL"
          onChange={handleChange}
          value={values.avatar || ""}
        />
        <span className="modal__input-error">{errors.avatar}</span>
      </label>
    </ModalWithForm>
  );
}

export default RegisterPage;