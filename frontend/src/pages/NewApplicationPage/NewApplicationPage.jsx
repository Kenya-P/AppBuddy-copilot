import { useState } from "react";
import { request } from "../../utils/api";

function NewApplicationPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <h1>New Application</h1>

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