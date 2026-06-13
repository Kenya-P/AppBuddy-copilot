import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as applicationsApi from "../../services/application.js";
import "./ApplicationDetailPage.css";

function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    roleTitle: "",
    company: "",
    coverLetter: "",
    answers: [],
  });

  const [copyMessage, setCopyMessage] = useState("");

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Copied to clipboard!");
      setTimeout(() => setCopyMessage(""), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyMessage("Failed to copy to clipboard.");
      setTimeout(() => setCopyMessage(""), 2000);
    }
  };

  useEffect(() => {
    applicationsApi
      .getApplicationById(token, id)
      .then((data) => {
        setApplication(data);
        setFormData({
          roleTitle: data.roleTitle || "",
          company: data.company || "",
          coverLetter: data.coverLetter || "",
          answers: data.answers || [],
        });
      })
      .catch((err) => console.error("Failed to load application:", err))
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await applicationsApi.deleteApplication(token, id);
      navigate("/applications");
    } catch (err) {
      console.error("Failed to delete application:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...formData.answers];

    updatedAnswers[index] = {
        ...updatedAnswers[index],
        [field]: value,
    };

    setFormData({
        ...formData,
        answers: updatedAnswers,
    });
  };

  const handleSaveChanges = async () => {
    setSaving(true);

    try {
        const updateApplication = await applicationsApi.updateApplication(token, id, formData);

        setApplication(updateApplication);
        setIsEditing(false);
    } catch (err) {
        console.error("Failed to update application:", err);
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <p>Loading application...</p>;
  if (!application) return <p>Application not found.</p>;

return (
  <div className="application-detail-page">
    <button className="application-detail-page__btn" onClick={() => navigate("/applications")}>Back</button>

    {!isEditing ? (
      <>
        <h1 className="application-detail-page__title">{application.roleTitle || "Untitled Role"}</h1>
        <p className="application-detail-page__company">{application.company || "No company listed"}</p>

        <h3 className="application-detail-page__section-title">Matched Keywords</h3>
        <p className="application-detail-page__section-content">{application.matchedKeywords?.join(", ") || "None"}</p>

        <h3 className="application-detail-page__section-title">Cover Letter</h3>
        <pre className="application-detail-page__cover-letter" style={{ whiteSpace: "pre-wrap" }}>{application.coverLetter}</pre>
        <button className="application-detail-page__btn" onClick={() => copyToClipboard(application.coverLetter)}>Copy Cover Letter</button>

        <h3 className="application-detail-page__section-title">Application Answers</h3>
        {application.answers?.map((item, index) => (
          <div key={index}>
            <h3 className="application-detail-page__question">{item.question}</h3>
            <p className="application-detail-page__answer">{item.answer}</p>
            
            <button className="application-detail-page__btn" onClick={() => copyToClipboard(item.answer)}>Copy Answer</button>
          </div>
        ))}

        <button className="application-detail-page__btn" onClick={() => setIsEditing(true)}>Edit Draft</button>

        <button className="application-detail-page__btn" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete Draft"}
        </button>
      </>
    ) : (
      <>
        <h2 className="application-detail-page__title">Edit Draft</h2>

        <label className="application-detail-page__label">
          Company
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </label>

        <label className="application-detail-page__label">
          Role Title
          <input
            name="roleTitle"
            value={formData.roleTitle}
            onChange={handleChange}
          />
        </label>

        <label className="application-detail-page__label">
          Cover Letter
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows="10"
          />
        </label>

        <h3 className="application-detail-page__section-title">Application Answers</h3>

        {formData.answers.map((item, index) => (
          <div key={index}>
            <label className="application-detail-page__label">
              Question
              <input
                className="application-detail-page__input"
                value={item.question}
                onChange={(e) =>
                  handleAnswerChange(index, "question", e.target.value)
                }
              />
            </label>

            <label className="application-detail-page__label">
              Answer
              <textarea
                className="application-detail-page__textarea"
                value={item.answer}
                onChange={(e) =>
                  handleAnswerChange(index, "answer", e.target.value)
                }
                rows="5"
              />
            </label>
          </div>
        ))}

        <button className="application-detail-page__btn" onClick={handleSaveChanges} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button className="application-detail-page__btn" onClick={() => setIsEditing(false)} disabled={saving}>
          Cancel
        </button>
      </>
    )}
  </div>
);
}

export default ApplicationDetailPage;