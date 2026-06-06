import { useState } from "react";
import { request } from "../../utils/api.js";
import Spinner from "../Spinner.jsx";
import * as applicationApi from "../../services/application.js";
import "./NewApplicationModal.css";

function NewApplicationModal({ isOpen, onClose, onApplicationCreated }) {
  const token = localStorage.getItem("jwt");

  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

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

      setCompany("");
      setRoleTitle("");
      setJobDescription("");
      setMessage("Application created.");
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
    <div className="new-application-modal modal_opened">
      <div className="new-application-modal__content">
        <button
          type="button"
          className="new-application-modal__close-btn"
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>

        <h2 className="new-application-modal__title">New Application</h2>

        <form onSubmit={handleGenerate}>
          <input
            type="text"
            className="new-application-modal__input"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
          />

          <input
            type="text"
            className="new-application-modal__input"
            placeholder="Role Title"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            disabled={loading}
          />

          <textarea
            className="new-application-modal__textarea"
            placeholder="Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            className="new-application-modal__btn"
            disabled={
              loading ||
              !company.trim() ||
              !roleTitle.trim() ||
              !jobDescription.trim()
            }
          >
            {loading ? (
              <>
                <Spinner /> Generating...
              </>
            ) : (
              "Generate Application"
            )}
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default NewApplicationModal;