import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as applicationsApi from "../../services/application.js";

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    applicationsApi
      .getApplications(token)
      .then(setApplications)
      .catch((err) => console.error("Failed to load applications:", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Loading saved applications...</p>;

  return (
    <div>
      <h1>Saved Applications</h1>

      {applications.length === 0 ? (
        <p>No saved drafts yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id}>
            <h2>{app.roleTitle || "Untitled Role"}</h2>
            <p>{app.company || "No company listed"}</p>
            <Link to={`/applications/${app._id}`}>View Draft</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default ApplicationsPage;