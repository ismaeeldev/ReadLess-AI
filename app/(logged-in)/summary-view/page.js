import { Suspense } from "react";
import SummaryView from "./ViewContent";

export default function SummaryViewPage() {
    return (
        <Suspense fallback={<div
            className="flex flex-col items-center justify-center  col-span-full"
            aria-busy="true"
            aria-live="polite"
        >
            <span className="text-lg font-semibold text-gray-700 mb-2">Loading...</span>
            <span className="flex gap-1 mt-2" aria-label="Loading">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-bounce"></span>
            </span>
        </div>}>
            <SummaryView />
        </Suspense>
    );
}
