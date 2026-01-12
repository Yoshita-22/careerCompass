
import express from "express";
import { ClerkExpressRequireAuth,requireAuth } from "@clerk/clerk-sdk-node";
import Resume from "../models/ResumeSchema.js";
const router = express.Router();

// Get all resumes for a logged-in user
router.get("/", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId; // from Clerk
    const resumes = await Resume.find({ userId });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// routes/resumeRoutes.js




// Save or update resume
router.post("/", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth; // Clerk injects this from JWT
    const { title, resumeData } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }

    if (!resumeData) {
      return res.status(400).json({ message: "Missing resume data" });
    }

    // Check if resume already exists for the same user + title
    const existing = await Resume.findOne({ userId, title });

    if (existing) {
      existing.resumeData = resumeData;
      existing.lastUpdated = new Date();
      await existing.save();
      return res.json({ message: "Resume updated successfully", resume: existing });
    }

    // 🆕 Create new resume document
    const newResume = await Resume.create({
      userId,
      title,
      resumeData,
    });

    res.status(201).json({
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (err) {
    console.error("Error saving resume:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});



// Delete a resume
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!resume) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//get specific resume

// GET /api/resumes/:id
router.get("/:id", ClerkExpressRequireAuth(), async (req, res) => {
  try {

    const userId = req.auth.userId;
    const resume = await Resume.findOne({ _id: req.params.id, userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//update specific resume
// PUT /api/resumes/:id
router.put("/:id", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;
    const { resumeData } = req.body;

    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid or missing resume ID" });
    }

    const updated = await Resume.findOneAndUpdate(
      { _id: id, userId },
      { resumeData, lastUpdated: new Date() },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Resume not found or unauthorized" });

    res.json({ message: "✅ Resume updated", resume: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
