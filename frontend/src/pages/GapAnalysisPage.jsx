import { useState } from "react";
import * as applicationApi from "../services/application.js";
import Spinner from "../components/Spinner.jsx";

function GapAnalysisPage() {
  const token = localStorage.getItem("jwt");

  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);

    try {
      const res = await applicationApi.request("/analyze", {
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
    <main>
      <h1>Skill Gap Analysis</h1>

      <textarea
        value={job}
        onChange={(e) => setJob(e.target.value)}
        placeholder="Paste job description..."
      />

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? <Spinner /> : "Analyze"}
      </button>

      {result && (
        <div className="card">
          <h3>Matched Skills</h3>
          <p>{result.matchedSkills.join(", ")}</p>

          <h3>Missing Skills</h3>
          <p>{result.missingSkills.join(", ")}</p>

          <h3>Suggestions</h3>
          <ul>
            {result.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

export default GapAnalysisPage;