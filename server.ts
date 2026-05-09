import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Admin Auth Endpoints
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    // Normalized to match user's provided email and password
    const adminEmail = "Flust786@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "##Royal@786";
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret";

    if (email?.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      const token = jwt.sign({ email: adminEmail, role: "admin" }, jwtSecret, { expiresIn: "1d" });
      res.cookie("admin_token", token, { 
        httpOnly: true, 
        secure: true, // Always true in AI Studio since it's behind proxy
        sameSite: "none", // Needed for iframe/cross-site behavior if applicable
        maxAge: 86400000 
      });
      return res.json({ success: true, user: { email, role: "admin" } });
    }
    res.status(401).json({ error: "Invalid credentials" });
  });

  app.get("/api/admin/verify", (req, res) => {
    const token = req.cookies.admin_token;
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret";

    if (!token) return res.status(401).json({ authenticated: false });
    
    try {
      const decoded = jwt.verify(token, jwtSecret);
      res.json({ authenticated: true, user: decoded });
    } catch {
      res.status(401).json({ authenticated: false });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie("admin_token");
    res.json({ success: true });
  });

  // Gemini AI Endpoints
  app.post("/api/ai/solve", async (req, res) => {
    try {
      const { query, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      // @ts-ignore
      const ai = new GoogleGenAI(apiKey);
      // @ts-ignore
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are a NEET Expert AI Tutor. Help the student with their doubt.
      ${context ? `Context: ${context}` : ""}
      User Query: ${query}
      Provide a detailed explanation, NCERT references if possible, and a clear summary.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json({ text: response.text() });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/quiz", async (req, res) => {
    try {
      const { subject, topic } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      // @ts-ignore
      const ai = new GoogleGenAI(apiKey);
      // @ts-ignore
      const model = ai.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
      
      const prompt = `Generate a 5-question NEET level MCQ quiz about ${topic} in ${subject}. 
      Return the response in JSON format:
      [{ "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "..." }]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json(JSON.parse(response.text()));
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/generate-mcq", async (req, res) => {
    try {
      const { topic, subject, difficulty } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      // @ts-ignore
      const ai = new GoogleGenAI(apiKey);
      // @ts-ignore
      const model = ai.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
      
      const prompt = `Generate a high-quality NEET level MCQ for the following:
      Topic: ${topic}
      Subject: ${subject}
      Difficulty: ${difficulty}

      Return a single JSON object with:
      {
        "text": "The question content...",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "solution": "Detailed step-by-step explanation...",
        "ncertRef": "Reference to NCERT Class/Chapter/Page",
        "tags": ["Tag1", "Tag2"],
        "estimatedTime": 60
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json(JSON.parse(response.text()));
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Mock API for rankings (if needed before Firestore is populated)
  app.get("/api/rankings", (req, res) => {
    res.json([
      { id: 1, name: "Rahul S.", score: 715, level: 15 },
      { id: 2, name: "Sneha K.", score: 710, level: 14 },
      { id: 3, name: "Amit P.", score: 708, level: 14 },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
