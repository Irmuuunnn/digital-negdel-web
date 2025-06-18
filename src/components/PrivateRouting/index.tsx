import React from "react";
import { Route, Navigate } from "react-router-dom";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const isLoggedIn = !!localStorage.getItem("token"); // Or use a more secure method for token storage
  const userHasAccess = isLoggedIn; // Add more checks based on user roles or permissions if needed

  return (
    <Route
      {...rest}
      element={
        isLoggedIn && userHasAccess ? <Component /> : <Navigate to="/login" />
      }
    />
  );
};

export default PrivateRoute;
