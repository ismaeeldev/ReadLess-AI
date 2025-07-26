import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export default async function fetchAndExtractPdf(ufsUrl) {
    // console.log("LanChain url" ,ufsUrl)

    const response = await fetch(ufsUrl);

    const blob = await response.blob();

    const arrayBuffer = await blob.arrayBuffer();

    const loader = new PDFLoader(new Blob([arrayBuffer]))

    const docs = await loader.load();

    return docs.map((doc) => doc.pageContent).join('\n');

}