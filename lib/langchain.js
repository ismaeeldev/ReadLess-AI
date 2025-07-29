import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export default async function fetchAndExtractPdf(ufsUrl) {
    console.log("🔍 Fetching PDF text..." + ufsUrl);

    try {
        // Fetch the PDF with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch(ufsUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();

        // Check if blob is actually a PDF
        if (!blob.type.includes('pdf')) {
            throw new Error('The fetched file is not a PDF');
        }

        const loader = new PDFLoader(blob); // You can pass the blob directly

        const docs = await loader.load();

        console.log("✅ PDF text fetched successfully");
        return docs.map((doc) => doc.pageContent).join('\n');
    } catch (error) {
        console.error("❌ Error fetching/processing PDF:", error);
        throw error; // Re-throw or return a default value if you prefer
    }
}