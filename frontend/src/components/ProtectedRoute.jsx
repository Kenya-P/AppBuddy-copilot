import { Navigate } from "react-router-dom";

function ProtectedRoute({ loggedIn, loading, children }) {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;