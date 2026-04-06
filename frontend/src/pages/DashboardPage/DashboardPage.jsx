import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext.jsx";

function DashboardPage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">Dashboard</h1>
      <p className="dashboard-page__welcome">Welcome, {currentUser?.name}</p>
    </div>
  );
}

export default DashboardPage;