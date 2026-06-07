import { useState } from "react";
import { request } from "../utils/api.js";
import Spinner from "../components/Spinner.jsx";

import "./GapAnalysisPage.css";

function GapAnalysisPage() {
  const token = localStorage.getItem("jwt");

  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!job.trim()) {
      console.error("Job description is required");
      return;
    }

    setLoading(true);

    try {
      const res = await request("/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobDescription: job }),
      });

      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="gap-analysis-page">
      <h1 className="gap-analysis-page__title">Skill Gap Analysis</h1>

      <textarea
        className="gap-analysis-page__textarea"
        value={job}
        onChange={(e) => setJob(e.target.value)}
        placeholder="Paste job description..."
      />

      <button className="gap-analysis-page__btn" onClick={handleAnalyze} disabled={loading || !job.trim()}>
        {loading ? <Spinner /> : "Analyze"}
      </button>

      {result && (
        <div className="gap-analysis-page__card">
          <h3 className="gap-analysis-page__card-title">Matched Skills</h3>
          <p className="gap-analysis-page__card-text">{result.matchedSkills.join(", ")}</p>

          <h3 className="gap-analysis-page__card-title">Missing Skills</h3>
          <p className="gap-analysis-page__card-text">{result.missingSkills.join(", ")}</p>

          <h3 className="gap-analysis-page__card-title">Suggestions</h3>
          <ul>
            {result.suggestions.map((s, i) => (
              <li key={i} className="gap-analysis-page__card-text">{s}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

export default GapAnalysisPage;