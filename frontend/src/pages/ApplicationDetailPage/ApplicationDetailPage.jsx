import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as applicationsApi from "../../services/application.js";

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
  <div className="application-page">
    <button onClick={() => navigate("/applications")}>Back</button>

    {!isEditing ? (
      <>
        <h1>{application.roleTitle || "Untitled Role"}</h1>
        <p>{application.company || "No company listed"}</p>

        <h2>Matched Keywords</h2>
        <p>{application.matchedKeywords?.join(", ") || "None"}</p>

        <h2>Cover Letter</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>{application.coverLetter}</pre>
        <button onClick={() => copyToClipboard(application.coverLetter)}>Copy Cover Letter</button>

        <h2>Application Answers</h2>
        {application.answers?.map((item, index) => (
          <div key={index}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
            
            <button onClick={() => copyToClipboard(item.answer)}>Copy Answer</button>
          </div>
        ))}

        <button onClick={() => setIsEditing(true)}>Edit Draft</button>

        <button onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete Draft"}
        </button>
      </>
    ) : (
      <>
        <h1>Edit Draft</h1>

        <label>
          Company
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </label>

        <label>
          Role Title
          <input
            name="roleTitle"
            value={formData.roleTitle}
            onChange={handleChange}
          />
        </label>

        <label>
          Cover Letter
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows="10"
          />
        </label>

        <h2>Application Answers</h2>

        {formData.answers.map((item, index) => (
          <div key={index}>
            <label>
              Question
              <input
                value={item.question}
                onChange={(e) =>
                  handleAnswerChange(index, "question", e.target.value)
                }
              />
            </label>

            <label>
              Answer
              <textarea
                value={item.answer}
                onChange={(e) =>
                  handleAnswerChange(index, "answer", e.target.value)
                }
                rows="5"
              />
            </label>
          </div>
        ))}

        <button onClick={handleSaveChanges} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button onClick={() => setIsEditing(false)} disabled={saving}>
          Cancel
        </button>
      </>
    )}
  </div>
);
}

export default ApplicationDetailPage;