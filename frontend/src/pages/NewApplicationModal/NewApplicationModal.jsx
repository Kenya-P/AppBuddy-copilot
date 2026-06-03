import { useState } from "react";
import { request } from "../../utils/api.js";
import Spinner from "../../components/Spinner.jsx";
import "./NewApplicationModal.css";

import * as applicationApi from "../../services/application.js";

function NewApplicationModal({ isOpen, onClose, onApplicationCreated }) {
  if (!isOpen) return null;

  return (
    <div className="new-application-modal modal_opened">
      <div className="new-application-modal__content">
        <button className="new-application-modal__close-btn" onClick={onClose}>×</button>

        <h2 className="new-application-modal__title">New Application</h2>

        {/* company, role title, job description, generate button */}
        <input type="text" className="new-application-modal__input" placeholder="Company Name" />
        <input type="text" className="new-application-modal__input" placeholder="Job Title" />
        <textarea className="new-application-modal__textarea" placeholder="Job Description"></textarea>
        <button className="new-application-modal__btn">Generate Application</button>

        {/* after auto-save succeeds: */}
        {/* onApplicationCreated(savedDraft); */}
      </div>
    </div>
  );
}

export default NewApplicationModal;