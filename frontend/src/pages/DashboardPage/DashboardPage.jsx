import { useEffect, useState } from "react";
import * as applicationApi from "../../services/application.js";
import * as profileApi from "../../services/profile.js";
import Spinner from "../../components/Spinner.jsx";
import "./DashboardPage.css";

function DashboardPage() {
  const token = localStorage.getItem("jwt");

  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateCompleteness = (profileData) => {
    if (!profileData) return {
      percentage: 0,
      missingFields: ["Full Name", "Email", "Location", "Summary", "Skills"],
    };

    const fields = [
      profileData.fullName,
      profileData.email,
      profileData.location,
      profileData.summary,
      profileData.skills?.length > 0,
    ];

    const filled = fields.filter(Boolean).length;
    const missingFields = ["Full Name", "Email", "Location", "Summary", "Skills"].filter((_, index) => !fields[index]);
    return {
      percentage: Math.round((filled / fields.length) * 100),
      missingFields,
    };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [applicationsData, profileData] = await Promise.all([
          applicationApi.getApplications(token),
          profileApi.getProfile(token),
        ]);

        setApplications(applicationsData);
        setProfile(profileData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) return <Spinner />;

  return (
    <main className="dashboard-page">

      <section className="profile-section">
        <h2 className="profile-section__title">Profile</h2>
        <p className="profile-section__completeness">Profile completeness: {calculateCompleteness(profile).percentage}%</p>
        {calculateCompleteness(profile).missingFields.length > 0 && (
          <ul className="profile-section__missing-fields">
            {calculateCompleteness(profile).missingFields.map((field) => (
              <li key={field}>{field} is missing</li>
            ))}
          </ul>
        )}
      </section>

      <section className="applications-section">
        <h2 className="applications-section__title">Your Applications</h2>

        {applications.length === 0 ? (
          <p className="applications-section__no-applications">No applications yet.</p>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="card">
              <h3 className="card__title">{app.roleTitle || "Untitled Role"}</h3>
              <p className="card__company">{app.company || "No company listed"}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default DashboardPage;