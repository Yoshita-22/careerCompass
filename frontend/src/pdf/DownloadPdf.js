// src/pdf/DownloadPdf.js
export const DownloadPdf = async () => {
  const resumeElement = document.getElementById("resume-preview");
  if (!resumeElement) {
    alert("Resume preview not found!");
    return;
  }

  try {
    // ✅ Extract ALL active styles (Tailwind + custom)
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch (e) {
          // Ignore security errors for external styles
          return "";
        }
      })
      .join("");

    // ✅ Construct full HTML with styles included
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <style>${styles}</style>
        </head>
        <body>
          ${resumeElement.outerHTML}
        </body>
      </html>
    `;

    // ✅ Send styled HTML to Puppeteer backend
    const response = await fetch("http://localhost:5000/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });

    if (!response.ok) throw new Error("PDF generation failed");

    // ✅ Handle PDF blob download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "My_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("Failed to generate PDF.");
  }
};
