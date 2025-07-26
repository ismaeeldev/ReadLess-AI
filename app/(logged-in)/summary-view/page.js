"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPdfSummary } from "@/lib/db";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = vfsFonts.vfs;

export default function SummaryViewPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const contentRef = useRef();

    useEffect(() => {
        let isMounted = true;
        async function fetchSummary() {
            setLoading(true);
            setError("");
            try {
                const data = await getPdfSummary(id);
                if (isMounted) setSummary(data);
            } catch (err) {
                setError("Failed to load summary. Please try again.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        if (id) fetchSummary();
        return () => { isMounted = false; };
    }, [id]);

    const handleDownload = async () => {
        const element = contentRef.current;
        if (!element) {
            toast.error("❌ No content found to download.");
            console.error("Error: contentRef.current is null or undefined");
            return;
        }
        try {
            let textContent = element.textContent || '';
            const content = [];
            if (typeof displayedText === "string" && /<[^>]+>/.test(displayedText)) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(`<div>${displayedText}</div>`, "text/html");
                const elements = doc.body.firstChild.childNodes;
                const tailwindStyles = {
                    "text-gray-800": { color: "#1F2937" },
                    "text-base": { fontSize: 12 },
                    "leading-relaxed": { lineHeight: 1.5 },
                    "font-bold": { bold: true },
                    "text-blue-500": { color: "#3B82F6" },
                };
                elements.forEach((el) => {
                    if (el.nodeType === 1) {
                        const tagName = el.tagName.toLowerCase();
                        const text = el.textContent;
                        const classList = Array.from(el.classList);
                        let style = {};
                        classList.forEach((cls) => {
                            if (tailwindStyles[cls]) {
                                style = { ...style, ...tailwindStyles[cls] };
                            }
                        });
                        if (tagName === "p") {
                            content.push({ text, style: { ...style, margin: [0, 0, 0, 10] } });
                        } else if (tagName === "h1" || tagName === "h2") {
                            content.push({
                                text,
                                style: { ...style, fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
                            });
                        } else {
                            content.push({ text, style });
                        }
                    }
                });
            } else {
                content.push({
                    text: textContent,
                    style: "body",
                });
            }
            const documentDefinition = {
                content: [
                    {
                        text: "Response Document",
                        style: "header",
                    },
                    ...content,
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10],
                        color: "#1F2937",
                    },
                    body: {
                        fontSize: 12,
                        lineHeight: 1.5,
                        margin: [0, 0, 0, 10],
                        color: "#1F2937",
                    },
                },
                pageSize: "LETTER",
                pageMargins: [40, 60, 40, 60],
                background: [
                    {
                        canvas: [
                            {
                                type: "rect",
                                x: 0,
                                y: 0,
                                w: 595.28,
                                h: 841.89,
                                color: "#FFFFFF",
                            },
                        ],
                    },
                ],
            };
            pdfMake.createPdf(documentDefinition).download("read-less-ai.pdf");
            toast.success("📄 PDF downloaded successfully!");
        } catch (error) {
            toast.error("❌ Failed to download PDF.");
            console.error("Download error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-rose-100 px-4 py-8 sm:px-6 lg:px-12">
            <div className="max-w-3xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 btn-gradient flex items-center gap-2 text-white hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <Card className="bg-white shadow-sm sm:shadow-md border border-gray-200 rounded-2xl w-full max-w-3xl">
                    <CardContent ref={contentRef} className="relative p-4 sm:p-6 text-gray-800 text-sm sm:text-base leading-relaxed transition-all duration-300 ease-in-out prose prose-sm sm:prose-base max-w-none">
                        {/* Download Button */}
                        {!loading && !error && (
                            <button
                                onClick={handleDownload}
                                className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full btn-gradient text-white shadow hover:scale-105 transition-transform"
                                aria-label="Download summary as PDF"
                            >
                                <Download className="w-5 h-5" />
                                <span className="hidden sm:inline">Download PDF</span>
                            </button>
                        )}
                        {loading ? (
                            <div
                                className="flex flex-col items-center justify-center min-h-[300px]"
                                aria-busy="true"
                                aria-live="polite"
                            >
                                <span className="text-lg font-semibold text-gray-700 mb-2">Loading</span>
                                <span className="flex gap-1 mt-2" aria-label="Loading">
                                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-bounce"></span>
                                </span>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 font-medium py-8">{error}</div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold mb-16 text-gray-900 text-center">
                                    {summary?.title || "Untitled Summary"}
                                </h1>
                                <div className="whitespace-pre-wrap break-words">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ children }) => (
                                                <p className="my-2 text-gray-800">{children}</p>
                                            ),
                                            h1: ({ children }) => (
                                                <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-900">{children}</h1>
                                            ),
                                            h2: ({ children }) => (
                                                <h2 className="text-xl font-semibold mt-3 mb-2 text-gray-900">{children}</h2>
                                            ),
                                            li: ({ children }) => (
                                                <li className="list-disc list-inside text-gray-800">{children}</li>
                                            ),
                                            strong: ({ children }) => (
                                                <strong className="font-semibold text-black">{children}</strong>
                                            ),
                                        }}
                                    >
                                        {summary?.summary_text || "No content available."}
                                    </ReactMarkdown>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
