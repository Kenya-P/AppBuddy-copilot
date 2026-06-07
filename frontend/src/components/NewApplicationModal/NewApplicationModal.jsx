import { useState } from "react";
import { request } from "../../utils/api.js";
import Spinner from "../Spinner.jsx";
import * as applicationApi from "../../services/application.js";
import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";
import "./NewApplicationModal.css";

function NewApplicationModal({ isOpen, onClose, onApplicationCreated }) {
  const token = localStorage.getItem("jwt");

  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setCompany("");
    setRoleTitle("");
    setJobDescription("");
    setMessage("");
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!company.trim() || !roleTitle.trim() || !jobDescription.trim()) {
      setMessage("Please fill out company, role title, and job description.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await request("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company,
          roleTitle,
          jobDescription,
        }),
      });

      const savedDraft = await applicationApi.createApplication(token, {
        company,
        roleTitle,
        jobDescription,
        coverLetter: data.coverLetter,
        answers: data.answers,
        matchedKeywords: data.matchedKeywords || [],
      });

      onApplicationCreated(savedDraft);
      resetForm();
      onClose();
    } catch (err) {
      console.error("Failed to create application:", err);
      setMessage(
        typeof err === "string"
          ? err
          : "Failed to generate and save application."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWithForm
      title="New Application"
      name="new-application"
      className="new-application-modal__title"
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleGenerate}
      buttonText={
        loading ? (
          <>
            <Spinner /> Generating...
          </>
        ) : (
          "Generate Application"
        )
      }
    >
      <label className="new-application-modal__label">
        Company
        <input
          name="company"
          type="text"
          placeholder="Company"
          className="new-application-modal__input"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={loading}
          required
        />
      </label>

      <label className="new-application-modal__label">
        Role Title
        <input
          name="roleTitle"
          type="text"
          placeholder="Role Title"
          className="new-application-modal__input"
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
          disabled={loading}
          required
        />
      </label>

      <label className="new-application-modal__label">
        Job Description
        <textarea
          name="jobDescription"
          placeholder="Paste job description"
          className="new-application-modal__textarea"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={loading}
          required
        />
      </label>

      {message && <p className="new-application-modal__message">{message}</p>}
    </ModalWithForm>
  );
}

export default NewApplicationModal;