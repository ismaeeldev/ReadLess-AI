'use client';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import { Copy, Download } from 'lucide-react';
import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import { useUploadThing } from "@/utils/uploadthing";
import { Loader2 } from "lucide-react";
import { generatePdfSummary } from "@/actions/upload-action";
import { savePdfSummary } from "@/lib/db";
pdfMake.vfs = vfsFonts.vfs;
import { generateFilenameFromName, generateTitleFromName } from "@/utils/pdfEditor";
import { getCurrentUserPlan } from "@/lib/db";

export default function UploadBox({ canUpload }) {
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [error, setError] = useState(null);
    const { startUpload } = useUploadThing("pdfUploader");
    const MAX_FILE_SIZE_MB = 20;
    const contentRef = useRef();
    const [AIResponse, setAIResponse] = useState('Upload a PDF to receive a concise, AI-generated summary.')
    const isMounted = useRef(true);
    const typingStartTime = useRef(null);
    const typingFrame = useRef(null);
    const TYPING_INTERVAL = 15;

    const [userPlan, setUserPlan] = useState(null);

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                const planData = await getCurrentUserPlan();
                setUserPlan(planData?.plan || 'starter');
            } catch (error) {
                console.error('Error fetching user plan:', error);
                setUserPlan('starter');
            }
        };

        fetchUserPlan();
    }, []);


    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            if (typingFrame.current) {
                cancelAnimationFrame(typingFrame.current);
            }
        };
    }, []);

    const handleFileChange = (e) => {
        setError(null);
        const file = e.target.files?.[0];
        if (!file) {
            setFileName("");
            toast.error("No file selected.");
            return;
        }
        const isPDF = file.type === "application/pdf";
        const isUnderLimit = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
        if (!isPDF) {
            setFileName("");
            toast.error("Only PDF files are allowed.");
            return;
        }
        if (!isUnderLimit) {
            setFileName("");
            toast.error(`File size should be less than ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }
        setFile(file)
        setFileName(file.name);
    };

    const handleFileSubmit = async () => {
        let summaryToastId;
        setError(null);

        try {
            setLoading(true);
            const res = await startUpload([file]);
            setLoading(false);
            const readingToastId = toast.loading("📄 Reading PDF...");
            await new Promise((resolve) => setTimeout(resolve, 5000));

            toast.dismiss(readingToastId);
            console.log("🔍 PDF text fetched..." + res[0].ufsUrl);
            summaryToastId = toast.loading("🧠 Parsing and summarizing with AI…");
            const summary = await generatePdfSummary(res);

            if (!summary) {
                throw new Error("Summary returned undefined or empty.");
            }

            const savedSummary = await savePdfSummary({ original_file_url: res[0].ufsUrl, summary_text: summary, title: generateTitleFromName(res[0].name), file_name: generateFilenameFromName(res[0].name) })

            console.log("🔍 Summary saved..." + savedSummary);

            if (!isMounted.current) return;
            setAIResponse(summary);
            setDisplayedText("");
            setIndex(0);
            setIsTyping(true);
            toast.success("✅ Summary generated!", {
                id: summaryToastId,
            });

        } catch (err) {
            console.error("Error during upload/summary:", err);

            if (summaryToastId) {
                toast.error("❌ Summary failed. Try again.", {
                    id: summaryToastId,
                });
            } else {
                toast.error("❌ Upload failed. Try again.");
            }
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isTyping) return;
        typingStartTime.current = performance.now();
        setDisplayedText("");
        setIndex(0);

        function typeStep() {
            if (!isMounted.current) return;
            const elapsed = performance.now() - typingStartTime.current;
            const charsToShow = Math.min(
                AIResponse.length,
                Math.floor(elapsed / TYPING_INTERVAL)
            );
            setDisplayedText(AIResponse.slice(0, charsToShow));
            setIndex(charsToShow);
            if (charsToShow < AIResponse.length) {
                typingFrame.current = requestAnimationFrame(typeStep);
            } else {
                setIsTyping(false);
            }
        }

        typingFrame.current = requestAnimationFrame(typeStep);

        return () => {
            if (typingFrame.current) {
                cancelAnimationFrame(typingFrame.current);
            }
        };
    }, [AIResponse, isTyping]);

    const handleCopy = () => {
        if (!displayedText) return;
        navigator.clipboard.writeText(displayedText);
        toast.success("📄 Response Copied successfully!");
    };

    const handleDownload = async () => {

        if (userPlan == 'starter') {
            toast.error("❌ Downloading summaries is a premium feature. Upgrade to Pro for unlimited PDF summaries, fast processing, downloads, and exclusive advanced tools.");
            return;
        }

        const element = contentRef.current;
        if (!element) {
            toast.error("❌ No content found to download.");
            console.error("Error: contentRef.current is null or undefined");
            return;
        }
        try {
            let textContent = element.textContent || displayedText;
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
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full px-4 md:px-6 mt-8 sm:mt-12 md:mt-14 flex flex-col gap-6 sm:gap-8 items-center"
        >


            {canUpload === false && (
                <div className="w-full max-w-xl bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Upload Limit Reached
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>
                                    You have reached your daily upload limit. Please upgrade your plan to continue uploading PDFs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Section */}
            <div className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={loading || canUpload === false}
                    className=" rounded-2xl p-1 flex-1 text-sm file:text-gray-600 file:border-none file:bg-white file:mr-2 file:cursor-pointer w-full"
                />
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                    <Button onClick={handleFileSubmit} className="btn-gradient text-white w-full sm:w-auto px-6 py-2 text-sm sm:text-base" disabled={loading || !file || canUpload === false}>
                        Upload PDF
                    </Button>)}
            </div>
            {/* Error display */}
            {error && (
                <div className="w-full max-w-xl text-red-600 text-sm mt-2 text-center">{error}</div>
            )}
            {/* AI Response Section */}
            <div className="w-full max-w-3xl mb-6 md:mb-8 relative">
                <Card className="bg-white shadow-sm sm:shadow-md border border-gray-200 rounded-lg relative">
                    <CardContent
                        className="p-4 sm:p-6 text-gray-800 text-sm sm:text-base leading-relaxed transition-all duration-300 ease-in-out prose prose-sm sm:prose-base max-w-none"
                        ref={contentRef}
                    >
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
                                {displayedText}
                            </ReactMarkdown>
                        </div>
                        {/* Copy & Download buttons */}
                        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex gap-2">
                            <Copy
                                aria-label="Copy summary"
                                onClick={handleCopy}
                                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                            />
                            <Download
                                aria-label="Download summary as PDF"
                                onClick={handleDownload}
                                className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 hover:text-rose-700 cursor-pointer transition-colors"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
