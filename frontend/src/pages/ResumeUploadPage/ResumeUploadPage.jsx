import { useState } from "react";
import * as resumeApi from "../../services/resume.js";
import Spinner from "../../components/Spinner.jsx";

function ResumeUploadPage() {
  const token = localStorage.getItem("jwt");

  const [file, setFile] = useState(null);
  const [parsedText, setParsedText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    </main>
  );
}

export default ResumeUploadPage;