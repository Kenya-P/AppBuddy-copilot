import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext.jsx";

function DashboardPage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {currentUser?.name}</p>
    </div>
  );
}

export default DashboardPage;