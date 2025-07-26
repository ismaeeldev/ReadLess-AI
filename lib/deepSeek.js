import Together from "together-ai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompt";

const together = new Together();

export default async function getSummaryFromDeepSeek(pdfText) {


    const response = await together.chat.completions.create({
        model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        messages: [
            { "role": "system", "content": SUMMARY_SYSTEM_PROMPT },
            { role: "user", content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}` },
        ],
    });

    return response.choices[0].message.content;
}