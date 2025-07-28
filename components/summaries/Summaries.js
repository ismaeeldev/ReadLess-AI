'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { getPdfSummaries, deletePdfSummary } from '@/lib/db';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SummaryCard from './SummaryCard';
import { toast } from 'sonner';

const PAGE_SIZE = 20;

const Summaries = () => {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef();

    const fetchSummaries = useCallback(async (reset = false, currentPage) => {
        setLoading(true);
        setError(null);
        try {
            const allSummaries = await getPdfSummaries();
            if (reset) {
                setSummaries(allSummaries.slice(0, PAGE_SIZE));
                setPage(1);
                setHasMore(allSummaries.length > PAGE_SIZE);
            } else {
                const nextPage = currentPage + 1;
                const newSummaries = allSummaries.slice(0, nextPage * PAGE_SIZE);
                setSummaries(newSummaries);
                setPage(nextPage);
                setHasMore(allSummaries.length > newSummaries.length);
            }
        } catch (err) {
            setError('Failed to load summaries.');
        }
        setLoading(false);
    }, []);


    useEffect(() => {
        fetchSummaries(true, page);
    }, [fetchSummaries]);


    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    fetchSummaries();
                }
            },
            { threshold: 1 }
        );

        const currentLoader = loaderRef.current;

        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [hasMore, loading, fetchSummaries]);


    const handleDeleteClick = useCallback((id) => {
        setDeleteId(id);
        setConfirmOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (deleteId) {
            setDeleteLoading(true);
            setError(null);
            try {
                await deletePdfSummary(deleteId);
                setDeleteId(null);
                setConfirmOpen(false);
                setDeleteLoading(false);
                toast.success('Summary deleted successfully');
                fetchSummaries(true);
            } catch (err) {
                setError('Failed to delete summary.');
                setDeleteLoading(false);
            }
        }
    }, [deleteId, fetchSummaries]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="px-4 md:px-8 lg:px-16 py-10 mt-20 sm:mt-10"
        >
            {error && (
                <div className="col-span-full text-center text-red-500 font-semibold mb-4">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaries.length === 0 && loading ? (
                    <div
                        className="flex flex-col items-center justify-center  col-span-full"
                        aria-busy="true"
                        aria-live="polite"
                    >
                        <span className="text-lg font-semibold text-gray-700 mb-2">Loading summaries...</span>
                        <span className="flex gap-1 mt-2" aria-label="Loading">
                            <span className="w-3 h-3 rounded-full bg-rose-600 animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-3 h-3 rounded-full bg-rose-600 animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-3 h-3 rounded-full bg-rose-600 animate-bounce"></span>
                        </span>
                    </div>
                ) : summaries.length === 0 ? (
                    <div className="col-span-full text-center">
                        <p className="text-gray-500">No summaries found</p>
                    </div>
                ) : (
                    summaries.map((summary) => (
                        <SummaryCard key={summary.id} summary={summary} onDelete={handleDeleteClick} />
                    ))
                )}
            </div>

            {hasMore && !loading && (
                <div ref={loaderRef} className="flex justify-center py-6">
                    <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="bg-white sm:max-w-md rounded-xl shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            Delete Summary?
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            Are you sure you want to delete this summary? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                            className="rounded-md px-4 py-2"
                            disabled={deleteLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            className="rounded-md px-4 py-2 btn-gradient"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.section>
    );
};

export default Summaries;
