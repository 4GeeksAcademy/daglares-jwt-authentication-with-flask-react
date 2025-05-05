import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

export default Protected;
// This component checks if a token exists in local storage. If it does, it renders the children components.
// If not, it redirects the user to the login page using the Navigate component from react-router-dom.