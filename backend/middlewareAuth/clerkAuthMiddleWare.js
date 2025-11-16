import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

export const requireAuth = ClerkExpressRequireAuth({
  onError: (err, req, res) => {
    console.error("Unauthorized:", err);
    res.status(401).json({ message: "Unauthorized" });
  },
});
