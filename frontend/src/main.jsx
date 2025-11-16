import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import { ResumeProvider } from "./AppContext/ResumeContext.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key! Add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => window.history.pushState(null, "", to)} // ensures smooth routing
    >
      <BrowserRouter>
        <ResumeProvider>
          <App />
        </ResumeProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
