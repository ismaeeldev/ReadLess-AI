import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompt";

export default async function getSummaryFromOpenRouter(pdfText) {
    const apikey = process.env.OPENROUTER_API_KEY;

    if (!apikey) {
        console.error("❌ Missing OpenRouter API key. Set OPENROUTER_API_KEY in your environment.");
        throw new Error("Missing OpenRouter API key.");
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apikey}`,
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: SUMMARY_SYSTEM_PROMPT },
                    {
                        role: "user",
                        content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
                    },
                ],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ OpenRouter API Error Response:", data);
            throw new Error(data.error?.message || "OpenRouter request failed.");
        }

        const summary = data?.choices?.[0]?.message?.content;

        if (!summary) {
            console.error("❌ Unexpected OpenRouter response:", data);
            throw new Error("Failed to retrieve summary from OpenRouter.");
        }

        return summary;
    } catch (error) {
        console.error("❌ OpenRouter Error:", error.message);
        throw error;
    }
}
