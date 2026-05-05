import { useState } from "react";
import { request } from "../../utils/api";

import * as aaplicationAoi from "../../services/application.js";

function NewApplicationPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");

  const token = localStorage.getItem("jwt");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await request("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobDescription }),
      });

      setResult(data);
    } catch (err) {
      console.error("Generation failed:", err);
      setError(typeof err === "string" ? err : "Failed to generate application materials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!result) return;

    setSaving(true);
    setSaveMessage("");

    try {
      await applicationApi.createApplication(token, {
        company,
        roleTitle,
        jobDescription,
        coverLetter: result.coverLetter,
        answers: result.answers,
        matchedKeywords: result.matchedKeywords || [],
      });
      setSaveMessage("Draft saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      setSaveMessage(typeof err === "string" ? err : "Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>New Application</h1>

      <input
        type="text"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        type="text"
        placeholder="Role Title"
        value={roleTitle}
        onChange={(e) => setRoleTitle(e.target.value)}
      />

      <textarea
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows="10"
        cols="60"
      />

      <br />

      <button onClick={handleGenerate} disabled={loading || !jobDescription.trim()}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p>{error}</p>}

      <button onClick={handleSaveDraft} disabled={saving}>
        {saving ? "Saving..." : "Save Draft"}
      </button>

      {saveMessage && <p>{saveMessage}</p>}

      {result && (
        <div>
          <h2>Matched Keywords</h2>
          <p>{result.matchedKeywords?.join(", ") || "None detected"}</p>

          <h2>Cover Letter</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result.coverLetter}</pre>

          <h2>Application Answers</h2>
          {result.answers?.map((item, index) => (
            <div key={index}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewApplicationPage;