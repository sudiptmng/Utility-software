import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "Please log in to access this page." }}
      />
    );
  }

  return children;
}

export default PrivateRoute;
