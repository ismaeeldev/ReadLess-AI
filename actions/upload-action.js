"use server"
import getSummaryFromGemini from "@/lib/gemini";
import fetchAndExtractPdf from "@/lib/langchain";
import getSummaryFromOpenAI from "@/lib/openai";
import getSummaryFromGroq from "@/lib/groq";
import getSummaryFromOpenRouter from "@/lib/openRouter";
import getSummaryFromTogether from "@/lib/togetherAi";
import getSummaryFromDeepSeek from "@/lib/deepSeek";



export async function generatePdfSummary(response) {

    if (!response) {
        return {
            success: false,
            message: 'File Upload Failed',
            data: null
        }
    }

    const { name, ufsUrl } = response[0];
    console.log(name, ufsUrl)

    if (!ufsUrl) {
        return {
            success: false,
            message: 'File Upload Failed',
            data: null
        }
    }

    try {
        console.log("🔍 Fetching PDF text..." + ufsUrl);
        const pdfText = await fetchAndExtractPdf(ufsUrl);

        const modelFallbacks = [
            { name: "Together", fn: getSummaryFromTogether },
            { name: "Groq", fn: getSummaryFromGroq },
            { name: "OpenRouter", fn: getSummaryFromOpenRouter },
            { name: "DeepSeek", fn: getSummaryFromDeepSeek },
            { name: "OpenAI", fn: getSummaryFromOpenAI },
            { name: "Gemini", fn: getSummaryFromGemini },
        ];

        for (const model of modelFallbacks) {
            try {
                const summary = await model.fn(pdfText);
                console.log(`✅ ${model.name} success`);
                return summary;
            } catch (error) {
                console.error(`❌ ${model.name} Error:`, error?.message || error);
            }
        }

        throw new Error("All models (Groq, OpenRouter, Together, OpenAI) failed.");
    } catch (finalError) {
        console.error("🚨 Final Error:", finalError.message || finalError);
        throw finalError;
    }


}