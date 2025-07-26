"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BrainCircuit, FolderUp } from "lucide-react";

const steps = [
    {
        icon: <FileText className="w-10 h-10 text-pink-600" />,
        title: "Upload your PDF",
        description: "Simply drag and drop your PDF document or click to upload",
    },
    {
        icon: <BrainCircuit className="w-10 h-10 text-pink-600" />,
        title: "AI Analysis",
        description: "Our advanced AI processes and analyzes your document instantly",
    },
    {
        icon: <FolderUp className="w-10 h-10 text-pink-600" />,
        title: "Get Summary",
        description: "Receive a clear, concise summary of your document",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.5,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

const Step = () => {
    return (
        <section className="bg-[#F9FAFB] py-16 px-4 sm:px-6 lg:px-20">
            {/* Section Header */}
            <motion.div
                className="text-center mb-12 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false, amount: 0.6 }}

            >
                <h3 className="text-sm font-semibold text-pink-600 uppercase tracking-wide">
                    How it works
                </h3>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                    Transform any PDF into an easy-to-digest summary in three simple steps
                </h2>
            </motion.div>

            {/* Steps Grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.6 }}

            >
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center text-center"
                        variants={cardVariants}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Card className="bg-pink-50 p-6 rounded-xl border-none shadow-md mb-4">
                            <div className="w-16 h-16 flex items-center justify-center bg-pink-100 rounded-xl">
                                {step.icon}
                            </div>
                        </Card>
                        <CardContent className="p-0">
                            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                            <p className="text-sm text-gray-600 mt-2">{step.description}</p>
                        </CardContent>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default Step;
