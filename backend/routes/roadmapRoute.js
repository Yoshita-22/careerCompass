// routes/roadmapRoute.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/* ----------------------  HELPERS ---------------------- */

/**
 * Attempts to extract and parse a JSON object from text,
 * handling potential markdown fences or incomplete JSON.
 * @param {string} text - The raw text output from the Gemini API.
 * @returns {object|null} The parsed JSON object or null on failure.
 */
function safeJsonParse(text) {
    if (!text) return null;
    
    // 1. Clean up common wrappers (like markdown fences)
    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    // 2. Find the content that looks like a JSON object
    const match = cleanText.match(/\{[\s\S]*\}/);
    
    if (!match) {
        console.warn("safeJsonParse failed: No JSON object found.");
        return null;
    }
    
    try {
        // 3. Attempt to parse the matched content
        return JSON.parse(match[0]);
    } catch (err) {
        console.warn(" JSON parse error:", err.message);
        console.warn("Problematic text (start):", match[0].slice(0, 500) + "...");
        return null;
    }
}

// Helper function to handle the API call logic
//  DEFAULT MODEL CHANGED TO 'gemini-2.5-pro' for robust task handling
async function fetchGemini(prompt, maxTokens, modelName = 'gemini-2.5-flash') {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("API Key Missing");
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.3,
                    responseMimeType: "application/json",
                    maxOutputTokens: maxTokens,
                },
            }),
        }
    );

    const data = await response.json();

    if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message}`);
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Log for debugging if truncation occurs
    if (data.usageMetadata?.totalTokenCount > maxTokens) {
        console.warn(` Warning: Max tokens likely hit on this call. Model: ${modelName}`);
    }

    return safeJsonParse(text);
}


/* ---------------------- MAIN ROUTE ---------------------- */
router.post("/", async (req, res) => {
    const { jobDescription, resume, duration } = req.body;

    if (!jobDescription || !resume || !duration) {
        return res
            .status(400)
            .json({ error: "Job description, resume, and duration are required." });
    }

    try {
        // ------------------ 1. ANALYSIS CALL (LOW TOKEN) ------------------
        // Uses the new 'gemini-2.5-pro' for more robust analysis logic adherence
        const analysisPrompt = `
You are an expert AI skill gap analyzer.
Analyze the following Job Description (JD) and Resume. Identify the **top 3 missing or weak skills only**.
Return ONLY valid JSON in this schema: {"missing_skills": ["<skill1>", "<skill2>", "<skill3>"]}

JD: """${jobDescription}"""
Resume: """${resume}"""
`;

        // The default model is now 'gemini-2.5-pro'
        const analysisResult = await fetchGemini(analysisPrompt, 512);

        if (!analysisResult?.missing_skills || analysisResult.missing_skills.length === 0) {
            console.error(" Failed to identify missing skills.");
            console.error("Raw Analysis Failure Data:", analysisResult);
            return res.json({ roadmap: [], error: "Could not identify skill gaps for roadmap creation." });
        }
        
        const skillsList = analysisResult.missing_skills.join(', ');

        // ------------------ 2. ROADMAP CALL (HIGH TOKEN) ------------------
        // Task: Generate the full roadmap based on the identified skills.
        const roadmapPrompt = `
You are an expert AI career mentor.
Create a step-by-step learning roadmap to master these skills: **${skillsList}**.

The roadmap must fit within the duration: ${duration}.
The roadmap must contain a **maximum of 2 learning steps**.

Each step should include:
- "week" or "phase"
- "focus" (main theme)
- "topics_summary" (a **single, short sentence** summary of areas to learn)
- "resources_summary" (a **single, comma-separated list of 2-3** key resources/URLs)
- "goal" (expected outcome - **3-5 words only**)

Return ONLY valid JSON in this schema:
{
  "roadmap": [
    {
      "week": "<string>",
      "focus": "<string>",
      "topics_summary": "<string>",
      "resources_summary": "<string>",
    
    }
  ]
}
`;

        // Use MAX tokens for the final complex output (still gemini-2.5-pro)
        const roadmapResult = await fetchGemini(roadmapPrompt, 2048); 

        // ------------------ 3. VALIDATE AND RESPOND ------------------
        if (!roadmapResult?.roadmap) {
            console.error(" Roadmap generation failed or returned invalid structure.");
            // Log the raw data here to see why the final structure failed
            console.error("Raw Roadmap Failure Data:", roadmapResult);
            return res.json({ roadmap: [] });
        }

        res.json(roadmapResult);
    } catch (err) {
        console.error("Gemini API error (Caught by try/catch):", err.message);
        res.status(500).json({ error: "Failed to generate roadmap due to an internal or API error." });
    }
});

export default router;