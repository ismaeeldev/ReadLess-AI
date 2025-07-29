
export const dynamic = 'force-dynamic';

import React from 'react'
import BgGradient from '@/components/common/bg-gradient'
import UploadHeader from '@/components/upload/UploadHeader'
import UploadForm from '@/components/upload/UploadForm'
import { canUserUploadPdf } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
    title: "Upload PDF | ReadLess - AI PDF Summarizer",
    description: "Upload your PDF to ReadLess and get instant AI-generated summaries. Simplify long documents, research papers, or reports into short, digestible insights. Perfect for students, professionals, and anyone who wants to read less and understand more.",
};


const page = async () => {
    let canUpload = false;

    try {
        const { userId } = await auth();
        if (userId) {
            canUpload = await canUserUploadPdf();
        }
    } catch (error) {
        console.error("Error fetching upload status:", error);
        canUpload = false;
    }

    return (
        <>
            <BgGradient />
            <UploadHeader />
            <UploadForm canUpload={canUpload} />
        </>
    )
}

export default page