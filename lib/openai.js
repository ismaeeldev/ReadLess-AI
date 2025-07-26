import OpenAI from "openai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompt";
import getSummaryFromGemini from "./gemini";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});



export default async function getSummaryFromOpenAI(pdfText) {

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SUMMARY_SYSTEM_PROMPT },
                {
                    role: "user", content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`
                },
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        return response.choices[0]?.message?.content || "No content returned.";
    } catch (error) {
        console.error("❌ OpenAI Error:", error?.message || error);

    }
}
