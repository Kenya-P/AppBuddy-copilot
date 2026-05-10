import { useEffect, useState } from "react";
import * as applicationApi from "../../services/application.js";
import * as profileApi from "../../services/profile.js";
import Spinner from "../../components/Spinner/Spinner.jsx";

function DashboardPage() {
  const token = localStorage.getItem("jwt");

  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateCompleteness = (profileData) => {
    if (!profileData) return 0;

    const fields = [
      profileData.fullName,
      profileData.email,
      profileData.location,
      profileData.summary,
      profileData.skills?.length > 0,
    ];

    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [applicationsData, profileData] = await Promise.all([
          applicationApi.getApplications(token),
          profileApi.getMyProfile(token),
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
    <main>
      <h1>Dashboard</h1>

      <section>
        <h2>Profile</h2>
        <p>Profile completeness: {calculateCompleteness(profile)}%</p>
      </section>

      <section>
        <h2>Your Applications</h2>

        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="card">
              <h3>{app.roleTitle || "Untitled Role"}</h3>
              <p>{app.company || "No company listed"}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default DashboardPage;