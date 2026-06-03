import { useState } from "react";
import { request } from "../../utils/api.js";
import Spinner from "../../components/Spinner.jsx";
import "./NewApplicationModal.css";

import * as applicationApi from "../../services/application.js";

function NewApplicationModal({ isOpen, onClose, onApplicationCreated }) {
  if (!isOpen) return null;

  return (
    <div className="modal modal_opened">
      <div className="modal__content">
        <button onClick={onClose}>×</button>

        <h2>New Application</h2>

        {/* company, role title, job description, generate button */}
        <input type="text" placeholder="Company Name" />
        <input type="text" placeholder="Job Title" />
        <textarea placeholder="Job Description"></textarea>
        <button>Generate Application</button>

        {/* after auto-save succeeds: */}
        {/* onApplicationCreated(savedDraft); */}
      </div>
    </div>
  );
}

export default NewApplicationModal;