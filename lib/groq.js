// getSummaryFromGroq.js
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompt";

export default async function getSummaryFromGroq(pdfText) {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        throw new Error("❌ GROQ_API_KEY is missing in environment variables.");
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [
                    { role: "system", content: SUMMARY_SYSTEM_PROMPT },
                    { role: 'user', content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}` }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Unknown Groq API error");
        }

        const summary = data.choices?.[0]?.message?.content;
        return summary || "No summary returned.";
    } catch (error) {
        console.error("❌ Groq API Error:", error.message);
        throw error;
    }
}
