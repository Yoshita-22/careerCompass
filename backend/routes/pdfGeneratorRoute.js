import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

// POST route to generate PDF
router.post("/", async (req, res) => {   // route is now just "/"
  const { html } = req.body;

  if (!html) {
    return res.status(400).send("HTML content missing.");
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
    });

    res.send(pdf);
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).send("Failed to generate PDF.");
  }
});

export default router;
