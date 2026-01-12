// routes/jdKeywordRoute.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

/* ---------------------- 🔧 HELPERS ---------------------- */

//  Extract valid JSON object from Gemini response text (More Robust)
function extractJson(text) {
  // 1. Remove Markdown code fences and any surrounding whitespace
  let cleanText = text.trim();
  cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');

  // 2. Now search for the first valid JSON block (starting with {)
  const match = cleanText.match(/\{[\s\S]*\}/);
  
  if (!match) {
    console.warn("extractJson failed: No curly braces found.");
    return null;
  }
  
  // 3. Attempt to parse the matched content
  try {
    return JSON.parse(match[0]);
  } catch (err) {
    console.warn("JSON parse error:", err.message);
    console.warn("Problematic text (start):", match[0].slice(0, 200) + "...");
    return null;
  }
}

// Remove duplicates and normalize capitalization
function dedupeAndNormalize(keywords) {
  const seen = new Map();
  for (const k of keywords || []) {
    const key = k.text?.toLowerCase().trim();
    if (!key) continue;
    if (!seen.has(key)) seen.set(key, { ...k, text: k.text.trim() });
  }
  return Array.from(seen.values());
}

/* ----------------------  MAIN ROUTE ---------------------- */

router.post("/", async (req, res) => {
  const { jd } = req.body;
  if (!jd?.trim()) {
    return res.status(400).json({ error: "Job description missing." });
  }

  // Strong, structured prompt — now limiting output to prevent MAX_TOKENS
  const prompt = `
You are an AI keyword extractor.
Return ONLY VALID JSON (no explanations, no markdown).
The JSON must strictly follow this schema:

{
  "keywords": [
    {
      "text": "<string>",
      "category": "<skill|tool|cert|role|soft_skill|education|experience_level>",
      "confidence": <float between 0 and 1>
    }
  ]
}

Extract ONLY the top 30 most critical skills, tools, certifications, and roles from the Job Description below.
Remove duplicates. Maintain capitalization for tool names (e.g. React.js, AWS).

Job Description:
"""
${jd}
"""
Return ONLY valid JSON.
  `;

  // Helper to call Gemini once with all necessary fixes
  async function callGemini() {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing from environment variables.");
      throw new Error("API Key Missing");
    }

    // Using the current, publicly available model
    const MODEL_NAME = 'gemini-2.5-flash'; 

    const response = await fetch(
      // Corrected URL structure with the appropriate model name
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            // Set to max allowed to minimize MAX_TOKENS issues
            maxOutputTokens: 2048, 
          },
          // Lower safety settings to prevent content filtering blocks
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
          ],
        }),
      }
    );

    const data = await response.json();

    // 1. Check for explicit API errors (e.g., Invalid API Key, Rate Limit)
    if (data.error) {
      console.error(" Gemini API returned an error:", data.error.message);
      throw new Error(`Gemini API Error: ${data.error.message}`);
    }

    const candidates = data?.candidates;

    // 2. Check for missing candidates array
    if (!candidates || candidates.length === 0) {
        console.error("Gemini API returned no candidates. Check API Key and Quota.");
        console.error("Full Response Body:", JSON.stringify(data));
        throw new Error("API returned no content candidates.");
    }
    
    // Get the text and finish reason
    const text = candidates?.[0]?.content?.parts?.[0]?.text || "";
    const finishReason = candidates?.[0]?.finishReason;
    
    // 3. Log based on finish reason
    if (finishReason === 'MAX_TOKENS') {
         // This should be less common now with the prompt adjustment
         console.error("Generation stopped due to MAX_TOKENS limit! Output is incomplete.");
    } else if (finishReason === 'SAFETY') {
        console.error("ontent was blocked by safety filters!");
        console.error("Safety Ratings:", JSON.stringify(candidates[0].safetyRatings));
    } else if (!text) {
        console.warn(` Text part is empty for unknown reason. Finish Reason: ${finishReason}`);
    }
    
    console.log(" Gemini raw output (trimmed):", text.slice(0, 200) + "...");
    return text;
  }

  try {
    //  First attempt
    let text = await callGemini();
    let parsed = extractJson(text);

    //  Retry once if invalid JSON
    if (!parsed?.keywords) {
      console.warn("First parse failed. Retrying once...");
      text = await callGemini();
      parsed = extractJson(text);
    }

    //  Still invalid after retry → fail gracefully
    if (!parsed?.keywords) {
      console.error("Gemini returned invalid JSON twice.");
      return res.status(200).json({ keywords: [] }); // return empty, not error
    }

    //  Deduplicate + send response
    const cleaned = dedupeAndNormalize(parsed.keywords);
    res.json({ keywords: cleaned });
  } catch (err) {
    console.error("Gemini API/Network error:", err.message);
    res.status(500).json({ error: "Failed to extract keywords due to internal or API error." });
  }
});

export default router;