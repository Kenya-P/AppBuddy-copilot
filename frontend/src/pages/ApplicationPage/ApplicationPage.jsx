import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewApplicationModal from "../../components/NewApplicationModal/NewApplicationModal.jsx";
import Spinner from "../../components/Spinner.jsx";
import * as applicationsApi from "../../services/application.js";

function ApplicationsPage() {
  const token = localStorage.getItem("jwt");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false);

  useEffect(() => {
    applicationsApi
      .getApplications(token)
      .then(setApplications)
      .catch((err) => console.error("Failed to load applications:", err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleApplicationCreated = (newApplication) => {
    setApplications((prev) => [newApplication, ...prev]);
    setIsNewApplicationOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <main>
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>Manage your saved application drafts.</p>
        </div>

        <button onClick={() => setIsNewApplicationOpen(true)}>
          New Application
        </button>
      </div>

      {applications.length === 0 ? (
        <p>No saved drafts yet. Create your first application.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} className="card">
            <h2>{app.roleTitle || "Untitled Role"}</h2>
            <p>{app.company || "No company listed"}</p>
            <Link to={`/applications/${app._id}`}>View Draft</Link>
          </div>
        ))
      )}

      <NewApplicationModal
        isOpen={isNewApplicationOpen}
        onClose={() => setIsNewApplicationOpen(false)}
        onApplicationCreated={handleApplicationCreated}
      />
    </main>
  );
}

export default ApplicationsPage;