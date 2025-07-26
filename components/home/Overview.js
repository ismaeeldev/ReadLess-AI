"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Target } from "lucide-react";
import { motion } from "framer-motion";

const content = [
    "📄 Instantly summarize lengthy PDFs into concise, easy-to-understand bullet points.",
    "⚡ Powered by AI to extract key insights, saving you hours of reading time.",
    "🧠 Understand complex documents in seconds with smart summarization algorithms.",
    "📁 Just upload your PDF — no sign-up or tech skills required.",
    "🌐 Perfect for students, researchers, and professionals who need quick knowledge.",
    "🔒 Your data is secure — we don’t store any uploaded files permanently.",
];


export default function QuickOverviewCard() {
    const [step, setStep] = useState(0);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, content.length - 1));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

    return (
        <div className="container mx-auto px-4">

            <motion.div
                className="mt-6 flex flex-col items-center justify-center min-h-screen px-2 sm:px-4 md:px-6 lg:px-10 xl:px-20"

                initial={{ y: 0 }}
                animate={{ y: [0, -20, 0, 20, 0] }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    willChange: 'transform',
                }}>
                {/* Progress bar */}
                <div className="flex gap-2 w-full max-w-md md:max-w-lg lg:max-w-xl mb-6 px-2 sm:px-4">

                    {content.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-pink-600" : "bg-pink-200"
                                }`}
                        />
                    ))}
                </div>

                {/* Card */}
                <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-3xl shadow-2xl border border-white bg-white px-2 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12">


                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-center mb-8 text-gray-900">
                        Quick Overview
                    </h2>

                    <CardContent className="relative min-h-[13rem] sm:min-h-[14rem] md:min-h-[16rem] lg:min-h-[18rem] xl:min-h-[20rem] h-auto bg-muted/40 rounded-xl px-2 py-4 sm:px-6 sm:py-6">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 flex flex-col justify-start items-start gap-3 text-left"
                        >
                            <div className="flex gap-3 p-2 items-start bg-gray-100 border-none rounded-xl">
                                <Target className="text-pink-600 mt-1 w-6 h-6 shrink-0" />
                                <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed">
                                    {content[step]}
                                </p>
                            </div>
                        </motion.div>
                    </CardContent>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-8 px-2 sm:px-4 gap-4">
                        <Button
                            onClick={prevStep}
                            disabled={step === 0}
                            className="rounded-full btn-gradient text-white"
                            size="icon"
                        >
                            <ArrowLeft />
                        </Button>

                        <div className="flex items-center gap-2">
                            {content.map((_, i) => (
                                <span
                                    key={i}
                                    className={`h-2 w-2 rounded-full ${i === step ? "bg-pink-600" : "bg-pink-300"
                                        }`}
                                />
                            ))}
                        </div>

                        <Button
                            onClick={nextStep}
                            disabled={step === content.length - 1}
                            className="rounded-full btn-gradient text-white"
                            size="icon"
                        >
                            <ArrowRight />
                        </Button>

                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
