import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as auth from "../../services/auth.js";
import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";
import { useFormAndValidation } from "../../utils/useFormAndValidation.js";


function RegisterPage({ isOpen, onClose, onRegister, isLoading, onClickLogin }) {
      const {
        values,
        handleChange,
        setValues,
        errors,
        resetForm,
        isValid
    } = useFormAndValidation({
        name: '',
        email: '',
        password: '',
        avatar: ''
    });
    
  return (
    <ModalWithForm
            buttonText={isLoading ? "Saving..." : "Sign Up"}
            title="Sign up"
            name="register"
            isOpen={isOpen}
            onClose={onClose}
            onOverlayClose={onClose}
            onSubmit={() => onRegister(values)}
            secondaryButtonText={"or Log in"}
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
                    value={values.email || ''}
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
                    title="Password must be at least 8 characters and and contain at least one letter and one number."
                    autoComplete="off"
                    autoCorrect="off"
                    onChange={handleChange}
                    value={values.password || ''}
                />
                <span className="modal__input-error">{errors.password}</span>
            </label>

            <label htmlFor="register-name" className="modal__label">
                Name
                <input
                type="text"
                name="name"
                className="modal__input"
                placeholder="Name"
                //pattern="^[a-zA-Z\s\-]+$"
                title="Name should contain only letters, spaces or hyphens"
                value={values.name || ''}
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
                    title="Please enter a valid URL."
                    autoComplete="off"
                    autoCorrect="off"
                    onChange={handleChange}
                    value={values.avatar || ''}
                />
                <span className="modal__input-error">{errors.avatar}</span>
            </label>
      </ModalWithForm>
  );
}

export default RegisterPage;