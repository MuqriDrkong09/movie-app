import React from "react";

type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
    const getPages = () => {
        return Array.from({ length: 5 }, (_, i) => {
            const page =
                currentPage <= 3
                    ? i + 1
                    : currentPage >= totalPages - 2
                        ? totalPages - 4 + i
                        : currentPage - 2 + i;

            return page >= 1 && page <= totalPages ? page : null;
        }).filter(Boolean);
    };

    return (
        <div className="flex justify-center mt-8 gap-1 flex-wrap">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Prev
            </button>

            {currentPage > 3 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-3 py-1 bg-white border border-blue-500 text-blue-500 rounded"
                    >
                        1
                    </button>
                    {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                </>
            )}

            {getPages().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page!)}
                    className={`px-3 py-1 rounded ${
                        currentPage === page
                            ? "bg-blue-700 text-white"
                            : "bg-white border border-blue-500 text-blue-500"
                    }`}
                >
                    {page}
                </button>
            ))}

            {currentPage < totalPages - 2 && (
                <>
                    {currentPage < totalPages - 3 && (
                        <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-3 py-1 bg-white border border-blue-500 text-blue-500 rounded"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
}
