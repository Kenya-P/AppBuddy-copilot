import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewApplicationModal from "../../components/NewApplicationModal/NewApplicationModal.jsx";
import Spinner from "../../components/Spinner.jsx";
import * as applicationsApi from "../../services/application.js";

import "./ApplicationPage.css";

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
      <div className="application-page">
        <div className="application-page__header">
          <h1 className="application-page__title">Applications</h1>
          <p className="application-page__subtitle">Manage your saved application drafts.</p>
        </div>

        <button className="application-page__btn" onClick={() => setIsNewApplicationOpen(true)}>
          New Application
        </button>
      </div>

      {applications.length === 0 ? (
        <p className="application-page__message">No saved drafts yet. Create your first application.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} className="application-page__card">
            <h2 className="application-page__card-title">{app.roleTitle || "Untitled Role"}</h2>
            <p className="application-page__card-company">{app.company || "No company listed"}</p>
            <Link to={`/applications/${app._id}`} className="application-page__link">View Draft</Link>
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