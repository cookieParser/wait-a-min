const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Generates specific, human-readable insights based on place data and reports using Google Gemini.
 * Falls back to heuristics if API key is missing or request fails.
 */
const generateInsights = async (place, recentReports) => {
    const API_KEY = process.env.GEMINI_API_KEY;

    // Fallback Heuristics (Original Logic)
    const runHeuristics = () => {
        const insights = [];
        const now = new Date();
        const currentHour = now.getHours();

        if (place.crowdLevel === 'High') {
            insights.push("It's currently busier than usual.");
        } else if (place.crowdLevel === 'Low') {
            insights.push("Great time to visit! Validated by low crowd reports.");
        }

        if (place.type === 'Restaurant') {
            if ((currentHour >= 12 && currentHour <= 14) || (currentHour >= 19 && currentHour <= 21)) {
                insights.push("Peak dining hours. Expect wait times.");
            } else {
                insights.push("Off-peak hours. Likely immediate seating.");
            }
        }

        const veryRecent = recentReports.filter(r => (now - new Date(r.timestamp)) < 1000 * 60 * 30);
        if (veryRecent.length > 2) {
            insights.push(`Live updates: ${veryRecent.length} people reported in the last 30 mins.`);
        }

        if (insights.length === 0) {
            insights.push("Waiting times are currently stable.");
        }
        return insights.slice(0, 2);
    };

    if (!API_KEY) {
        console.log("AI: Gemini API Key missing, using heuristics.");
        return runHeuristics();
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an AI assistant for WaitClarity, a real-time wait time app.
            Generate 2 short, helpful, and concise insights (max 15 words each) for the following location:
            
            Name: ${place.name}
            Type: ${place.type}
            Current Wait Time: ${place.currentWaitTime} minutes
            Crowd Level: ${place.crowdLevel}
            Recent Reports: ${recentReports.length > 0 ? recentReports.map(r => `${r.waitTimeReported}m wait`).join(', ') : 'No recent reports'}
            Current Time: ${new Date().toLocaleTimeString()}
            
            Guidelines:
            - Focus on whether now is a good time to visit.
            - Be empathetic and professional.
            - Format output as a JSON array of strings: ["insight1", "insight2"]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Basic cleaning in case Gemini adds markdown code blocks
        const cleanedText = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (err) {
        console.error("AI: Gemini integration error:", err);
        return runHeuristics();
    }
};

module.exports = { generateInsights };
