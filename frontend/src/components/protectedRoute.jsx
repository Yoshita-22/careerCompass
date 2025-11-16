// components/protectedRoute.jsx
import React from "react";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  // Wait until Clerk finishes loading before deciding
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  // If not signed in, redirect to login
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Otherwise render the child component
  return children;
};

export default ProtectedRoute;
