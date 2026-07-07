import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// API Route for AI compliance copilot
app.post("/api/ai-copilot", async (req, res) => {
  try {
    const { messages, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured in the backend environment. Please set it in Settings > Secrets." 
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Prepare conversation history
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const systemInstruction = `You are a highly skilled, expert AI Copilot for a hospital compliant with NABH (National Accreditation Board for Hospitals & Healthcare Providers) and ABDM (Ayushman Bharat Digital Mission). 
Your target users are doctors, nurse-in-charges, clinical directors, and administrative compliance officers.

You have live, real-time access to the current system state, metrics, and incident log context:
${JSON.stringify(context || {}, null, 2)}

Your capabilities and responses should cover:
1. **NABH Incident Auditing & CAPA**: If asked to draft a CAPA (Corrective and Preventive Action) for a logged incident (like a patient fall, medication error, or syringe issue), provide a structured plan (Immediate Correction, Root Cause Analysis, Corrective Action, Preventive Action, Responsibility, and Monitoring Timeline).
2. **ABDM Milestones Guidance**: Explain ABDM milestones M1, M2, M3, and M4, and guide developers/administrators on clinical APIs (FHIR, HL7, HFR/HPR registration, demographic validation).
3. **Clinical Quality KPIs**: Offer expert analyses of metrics like HAI (Hospital Acquired Infections), Readmission Rates, Average Length of Stay, Bed Occupancy, and patient satisfaction, suggesting operational improvements.
4. **General Healthcare Inquiries**: Provide clinically-grounded, humble, and operationally precise answers. Avoid clinical jargon overload; give direct and actionable responses.

Style: Highly professional, authoritative yet supportive, structured with clear markdown headings, bold points, and clean lists. Avoid fluff or self-congratulations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.6,
      }
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI service." });
  }
});

// For Vercel Serverless Function deployment, we do not start the listener or Vite dev middleware.
// Vercel routes '/api/*' directly to this script as a function, and Vercel serves the static build.
if (process.env.VERCEL !== "1") {
  async function startServer() {
    const PORT = Number(process.env.PORT) || 3000;

    // Vite middleware for asset pipeline in dev mode
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }

  startServer().catch(err => {
    console.error("Server startup failed:", err);
  });
}

export default app;
