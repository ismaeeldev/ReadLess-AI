import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = vfsFonts.vfs;

const trimToWords = (text, wordCount = 10) => {
    const words = text.split(' ');
    return words.length <= wordCount ? text : words.slice(0, wordCount).join(' ') + '...';
};

export default function SummaryCard({ summary, onDelete }) {
    const router = useRouter();

    const handleDownload = async (e) => {
        e.stopPropagation();
        if (!summary.summary_text) {
            toast.error("❌ No content found to download.");
            return;
        }
        try {
            const documentDefinition = {
                content: [
                    { text: summary.title || "Summary", style: "header" },
                    { text: summary.summary_text, style: "body" }
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
        <Card
            key={summary.id}
            onClick={() => router.push(`/summary-view?id=${summary.id}`)}
            className="cursor-pointer relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200 border border-gray-200 "
        >
            <CardContent className="p-0 flex flex-col h-full justify-between">
                <div className="text-xs text-gray-400 absolute top-4 right-4">
                    {new Date(summary.created_at).toLocaleDateString()}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-950 mb-1 min-h-[3.5rem] overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis'
                    }}>
                        {summary.title}
                    </h3>
                    <p className="text-sm text-gray-700 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis'
                    }}>
                        {trimToWords(summary.summary_text)}
                    </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                    <Badge
                        variant="outline"
                        className="text-green-600 border-green-400 rounded-full text-xs px-3 py-1"
                    >
                        {summary.status || 'Success'}
                    </Badge>
                    <div className="flex items-center gap-2">
                        <Trash2
                            aria-label="Delete summary"
                            className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() => onDelete(summary.id)}
                        />
                        <Download
                            aria-label="Download PDF"
                            className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={handleDownload}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}