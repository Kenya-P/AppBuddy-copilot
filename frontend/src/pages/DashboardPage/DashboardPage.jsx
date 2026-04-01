import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

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