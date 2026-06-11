import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google Gen AI SDK
// Uses GEMINI_API_KEY from environment variables and sets correct user agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

// API route: Optimize profile bio
app.post("/api/gemini/optimize-bio", async (req, res) => {
  const { originalBio, identity, goals } = req.body;

  if (!originalBio) {
    return res.status(400).json({ error: "originalBio is required" });
  }

  try {
    const prompt = `Please rewrite and optimize the following dating app bio. 
The user identifies as: ${identity || "Not specified"}.
Their relationship goal is: ${goals || "Not specified"}.
Original Bio: "${originalBio}"

Identify key personality traits, interests, and strengths. Rewrite it in three distinct tones:
1. Warm & Friendly - inviting, authentic, down-to-earth.
2. Playful & Wit - humorous, engaging, slightly cheeky.
3. Minimalist & Deep - thoughtful, direct, concise.

Ensure the bios are respectful, empowering, and attractive. Do not include any invasive or derogatory language. Support their identity and match-matching intent. Return the response in a structured JSON format containing the three variations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["warm", "playful", "minimalist"],
          properties: {
            warm: {
              type: Type.STRING,
              description: "A warm and friendly optimized bio.",
            },
            playful: {
              type: Type.STRING,
              description: "A playful, humorous, and witty optimized bio.",
            },
            minimalist: {
              type: Type.STRING,
              description: "A clean, concise, and deep minimized bio.",
            },
          },
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in bio optimization:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// API route: Generate personalized icebreakers
app.post("/api/gemini/icebreakers", async (req, res) => {
  const { partnerBio, partnerInterests, partnerName } = req.body;

  if (!partnerBio && (!partnerInterests || partnerInterests.length === 0)) {
    return res.status(400).json({ error: "partnerBio or partnerInterests are required to generate icebreakers" });
  }

  try {
    const prompt = `Generate exactly 3 creative, engaging, and highly respectful dating app icebreakers for someone named "${partnerName || "them"}".
Their Bio: "${partnerBio || "Not provided"}"
Their listed interests: ${(partnerInterests || []).join(", ") || "Not specified"}

Instructions:
- Make the questions fun, specific, and connected to their listed interests or bio.
- Do NOT make them generic (e.g. avoid "How is your day?").
- Ensure they are friendly and non-invasive.
- Keep them authentic and conversational.

Return a JSON array containing these 3 icebreakers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const resultText = response.text || "[]";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error generating icebreakers:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// API route: Dating Coach / Conversational Ally Assistant
// Review conversation draft, check appropriateness, and suggest improvements.
app.post("/api/gemini/chat-helper", async (req, res) => {
  const { draftMessage, chatHistory, userRole, matchRole } = req.body;

  if (!draftMessage) {
    return res.status(400).json({ error: "draftMessage is required" });
  }

  try {
    const prompt = `You are an expert, affectionate, and inclusive LGBTQ+ dating coach and ally. 
You are helping a user refine their message draft or suggesting a respectful response.
User Identity: ${userRole || "Dater"}
Match Identity: ${matchRole || "Dater"}
Current Draft Message: "${draftMessage}"
Recent Chat History Context (if any): "${chatHistory || "No previous messages"}"

Please analyze this draft from a perspective of safety, comfort, respect, and interest.
Specifically evaluate:
1. Respect & Inclusive Language: Is the tone polite and considerate? Does it avoid invasive questions (especially regarding trans/medical topics too early/unprompted)?
2. Engaging Quality: Does it encourage a safe, pleasant conversation?

Provide a JSON object containing:
- "feedback": 2-3 sentences of loving, constructive coach feedback.
- "improvedDraft": A refined, more organic, polite, or confident version of their message.
- "safetyScore": A rating from 1 to 10 of how respectful/appropriate the message is (avoiding invasive/awkward gender questions, etc.).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["feedback", "improvedDraft", "safetyScore"],
          properties: {
            feedback: {
              type: Type.STRING,
              description: "Warm feedback or microaggression checker explanations.",
            },
            improvedDraft: {
              type: Type.STRING,
              description: "An optimized draft that sounds highly organic, confident, and respectful.",
            },
            safetyScore: {
              type: Type.INTEGER,
              description: "Safety rating from 1 to 10.",
            },
          },
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in chat helper:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// API route: Date Planner
// Suggests local, respectful, and accessible date ideas based on user and partner interests/locations.
app.post("/api/gemini/date-planner", async (req, res) => {
  const { userInterests, partnerInterests, userLocation, partnerLocation, partnerName } = req.body;

  try {
    const prompt = `You are a thoughtful, creative, and inclusive LGBTQ+ relationship coach and expert planner. 
Suggest exactly 3 local, respectful, and accessible date ideas for a transmasculine individual (FTM) and their partner/ally named "${partnerName || "their partner"}".

User's interests: ${(userInterests || []).join(", ") || "Not specified"}
User's location: ${userLocation || "Not specified"}
Partner's interests: ${(partnerInterests || []).join(", ") || "Not specified"}
Partner's location: ${partnerLocation || "Not specified"}

Instructions for each date idea:
- **Respect & Safety**: The date should be in a public, safe, trans-friendly, and welcoming space. Keep the initial physical boundary pressure minimal. It should not involve invasive queries or awkward pressure.
- **Interests Synergy**: Try to find unique ways to combine interests from both sides (e.g., if one likes pottery and another likes coffee, suggest a paint-your-own-mug workshop with a café break).
- **Physical & Mental Accessibility**: Provide a thoughtful accessibilityTip (e.g., quiet corners for neurodivergent comfort, flat seating, gender-neutral restrooms, or low financial pressure).
- **Locations**: Make them feel realistic for their general locations (or elegant concepts if locations are unspecified).

Return a JSON array containing exactly 3 date ideas. Each option MUST follow this schema:
{
  "title": "A short, catchy title of the date",
  "description": "A warm, engaging description of what they will do",
  "location": "Recommended setting or venue type suitable for people in their areas",
  "relevance": "How it merges and respects their unique interests",
  "accessibilityTip": "A helpful accessibility or sensory comfort advisory",
  "respectTip": "A respect/ally check-in tip to support a comfortable, validating experience"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["title", "description", "location", "relevance", "accessibilityTip", "respectTip"],
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              location: { type: Type.STRING },
              relevance: { type: Type.STRING },
              accessibilityTip: { type: Type.STRING },
              respectTip: { type: Type.STRING }
            }
          }
        }
      }
    });

    const resultText = response.text || "[]";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in date planner:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// Setup Vite Dev server / production static server
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in Development Mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in Production Mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve client-side bundle fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully listening on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Vite server initialization failed:", err);
});
