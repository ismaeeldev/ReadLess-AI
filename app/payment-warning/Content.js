"use client";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail, ArrowRight, Info } from "lucide-react";

export default function PaymentWarning() {
  const searchParams = useSearchParams();
  const link = searchParams.get("link");

  const handleManualRedirect = () => {
    if (link) window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-rose-50 px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-8 border border-rose-100">
        <Badge variant="gradient" className="flex items-center gap-2 px-3 py-2 text-base">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Payment Instructions
        </Badge>
        <div className="flex items-center justify-center gap-3 w-full">

          <h2 className="text-2xl md:text-3xl font-bold text-center text-rose-700 leading-tight whitespace-normal">
            Use Your Readless Account Email
          </h2>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="text-gray-700 text-base md:text-lg text-center font-semibold bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
            Please use the <span className="underline">same email address</span> associated with your Readless AI account when paying on the next page.
          </div>
          <div className="text-gray-700 text-base md:text-lg text-center">
            <span className="font-medium text-rose-700">Why?</span> This ensures your subscription is activated instantly and correctly.
          </div>
          <ul className="mb-2 text-left text-gray-600 text-base md:text-lg mt-2 px-2 space-y-2">
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
              <span>Double-check your email before proceeding.</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-rose-500 mt-1" />
              <span>If you use Google/Apple sign-in, use that email for payment.</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-5 h-5 text-blue-500 mt-1" />
              <span>Contact support if you have any issues.</span>
            </li>
          </ul>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mt-2">
            <Info className="w-5 h-5 text-blue-500" />
            <span className="text-blue-700 text-sm md:text-base">
              If you use a different email, your upgrade may be delayed or require manual verification.
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 w-full mt-2">
          <Button
            onClick={handleManualRedirect}
            className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full flex items-center justify-center gap-2 shadow hover:scale-105 transition"
          >
            Continue to Payment <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 