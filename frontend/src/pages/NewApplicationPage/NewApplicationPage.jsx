import { useState } from "react";
import { request } from "../../utils/api";
import Spinner from "../../components/Spinner.jsx";

import * as applicationApi from "../../services/application.js";

function NewApplicationPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const [autoSavedAppId, setAutoSavedAppId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [customQuestions, setCustomQuestions] = useState("");
  const [customAnswers, setCustomAnswers] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);

  const token = localStorage.getItem("jwt");

  const generateApplication = async ({ regenerate = false } = {}) => {
    setLoading(true);
    setError("");
    setSaveStatus("");

    if (regenerate) {
      setIsRegenerating(true);
    }

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

      setResult(data);

      const savedDraft = await applicationApi.createApplication(token, {
        company,
        roleTitle,
        jobDescription,
        coverLetter: data.coverLetter,
        answers: data.answers,
        matchedKeywords: data.matchedKeywords || [],
      });

      setAutoSavedAppId(savedDraft._id);
      setSaveStatus(regenerate ? "New version auto-saved." : "Draft auto-saved.");
    } catch (err) {
      console.error("Generation failed:", err);
      setError(
        typeof err === "string"
          ? err
          : "Failed to generate application materials."
      );
    } finally {
      setLoading(false);
      setIsRegenerating(false);
    }
  };

  const handleGenerateAnswer = async () => {
  setAnswerLoading(true);

  try {
    const data = await request("/generate-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: customQuestion,
        jobDescription,
      }),
    });

    setCustomAnswer(data.answer);
  } catch (err) {
    console.error("Failed to generate answer:", err);
  } finally {
    setAnswerLoading(false);
  }
};

  const handleSaveCopy = async () => {
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

  const handleGenerate = () => {
    generateApplication();
  };

  const handleRegenerate = () => {
    generateApplication({ regenerate: true });
  };

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
  }

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

      <button
        onClick={handleGenerate}
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
          "Generate"
        )}
      </button>

      {error && <p>{error}</p>}

      <button onClick={handleSaveCopy} disabled={saving}>
        {saving ? <Spinner size="small" /> : "Save Draft"}
      </button>

      {saveMessage && <p>{saveMessage}</p>}

      {result && (
        <div>
          <h2>Matched Keywords</h2>
          <p>{result.matchedKeywords?.join(", ") || "None detected"}</p>

          <h2>Cover Letter</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result.coverLetter}</pre>
          <button onClick={() => copyToClipboard(result.coverLetter)}>Copy Cover Letter</button>

          <h2>Application Answers</h2>
          {result.answers?.map((item, index) => (
            <div key={index}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      )}

      <div className="result-card__section">
        <h3>Custom Question</h3>

        <input
          placeholder="Paste a custom application question..."
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
        />

        <button onClick={handleGenerateAnswer} disabled={answerLoading}>
          {answerLoading ? <Spinner /> : "Generate Answer"}
        </button>

        {customAnswer && (
          <div className="answer-card">
            <p>{customAnswer}</p>
            <button onClick={() => copyToClipboard(customAnswer)}>
              Copy Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewApplicationPage;