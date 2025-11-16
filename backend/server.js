import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import pdfGeneratorRoute from "./routes/pdfGeneratorRoute.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import jdKeywordRoute from "./routes/jdKeywordRoute.js"
import roadmapRoute from "./routes/roadmapRoute.js";



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(ClerkExpressWithAuth());

// Connect DB
connectDB(process.env.MONGO_URI);

// Routes
app.use("/api/resumes", resumeRoutes);
app.use("/generate-pdf", pdfGeneratorRoute); // Perfect
app.use("/api/extract-keywords", jdKeywordRoute);
app.use("/api/generate-roadmap", roadmapRoute);
// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
