import { useState } from "react";
import { request } from "../../utils/api";

function NewApplicationPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("jwt");

  const handleGenerate = async () => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>New Application</h1>

      <textarea
        placeholder="Paste job description..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {result && (
        <div>
          <h2>Cover Letter</h2>
          <p>{result.coverLetter}</p>

          <h2>Answers</h2>
          {result.answers.map((item, i) => (
            <div key={i}>
              <strong>{item.question}</strong>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewApplicationPage;