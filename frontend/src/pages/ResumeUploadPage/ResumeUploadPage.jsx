import { useState } from "react";
import * as resumeApi from "../../services/resume.js";
import * as profileApi from "../../services/profile.js";
import Spinner from "../../components/Spinner.jsx";

function ResumeUploadPage() {
  const token = localStorage.getItem("jwt");

  const [file, setFile] = useState(null);
  const [parsedText, setParsedText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [structureProfile, setStructureProfile] = useState(null);
  const [structuring, setStructuring] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);

  const handleFileChange = (e) => {
    setMessage("");
    setParsedText("");
    setFileName("");

    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setMessage("Please upload a PDF file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please choose a resume PDF first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await resumeApi.parseResume(token, file);
      setParsedText(data.text || "");
      setFileName(data.fileName || file.name);
      setMessage("Resume parsed successfully.");
    } catch (err) {
      console.error("Resume upload failed:", err);
      setMessage(typeof err === "string" ? err : "Failed to parse resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleStructureResume = async () => {
    if (!parsedText) return;

    setStructuring(true);
    setMessage("");

    try {
      const data = await resumeApi.structureResume(token, parsedText);
      setStructureProfile(data);
      setMessage("Resume structured successfully.");
    } catch (err) {
      console.error("Resume structuring failed:", err);
      setMessage(typeof err === "string" ? err : "Failed to extract profile fields.");
    } finally {
      setStructuring(false);
    }
  };

  const handleApplyToProfile = async () => {
  if (!structureProfile) return;

  setSavingProfile(true);
  setMessage("");

  try {
    await profileApi.updateProfile(token, structureProfile);
    setMessage("Profile updated successfully 🎉");
  } catch (err) {
    console.error("Profile update failed:", err);
    setMessage("Failed to update profile.");
  } finally {
    setSavingProfile(false);
  }
};

  return (
    <main>
      <h1>Upload Resume</h1>
      <p>Upload a PDF resume to extract your profile information.</p>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={loading}
        />

        <button type="submit" disabled={loading || !file}>
          {loading ? (
            <>
              <Spinner /> Parsing...
            </>
          ) : (
            "Parse Resume"
          )}
        </button>
      </form>

      {message && <p>{message}</p>}

      {parsedText && (
        <section className="result-card">
          <h2>{fileName}</h2>
          <h3>Extracted Resume Text</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{parsedText}</pre>
        </section>
      )}

      <button
        onClick={handleStructureResume}
        disabled={structuring || !parsedText}
      >
        {structuring ? (
          <>
            <Spinner /> Structuring...
          </>
        ) : (
          "Structure Resume"
        )}
      </button>

      {structureProfile && (
        <section className="result-card">
          <h2>Extracted Profile Preview</h2>

          <p><strong>Name:</strong> {structureProfile.fullName}</p>
          <p><strong>Email:</strong> {structureProfile.email}</p>
          <p><strong>Phone:</strong> {structureProfile.phone}</p>
          <p><strong>Location:</strong> {structureProfile.location}</p>
          <p><strong>LinkedIn:</strong> {structureProfile.linkedin}</p>
          <p><strong>GitHub:</strong> {structureProfile.github}</p>
          <p><strong>Portfolio:</strong> {structureProfile.portfolio}</p>

          <h3>Summary</h3>
          <p>{structureProfile.summary}</p>

          <h3>Skills</h3>
          <p>{structureProfile.skills?.join(", ")}</p>
       
          <button onClick={handleApplyToProfile} disabled={savingProfile}>
          {savingProfile ? (
            <>
              <Spinner /> Saving...
            </>
          ) : (
            "Apply to Profile"
          )}
        </button>
       
        </section>
      )}
          </main>
        );
      }

export default ResumeUploadPage;