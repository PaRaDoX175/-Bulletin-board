export default function Pagination({ pagination, setPagination, totalCount }) {
    const totalPages = Math.ceil(totalCount / pagination.pageSize);

    if (totalPages <= 1) return <></>

    let start = Math.max(1, pagination.pageIndex - 1);
    let end = Math.min(totalPages, start + 2);

    if (end - start < 2 && start > 1) {
        start = Math.max(1, end - 2);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
                disabled={pagination.pageIndex === 1}
                className={`px-3 py-1 rounded-md border ${
                    pagination.pageIndex === 1
                        ? "text-gray-400 border-gray-300"
                        : "text-blue-600 border-blue-400 hover:bg-blue-50"
                }`}
            >
                &lt;
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => setPagination({ ...pagination, pageIndex: page })}
                    className={`px-3 py-1 rounded-md border ${
                        page === pagination.pageIndex
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-blue-600 border-blue-400 hover:bg-blue-50"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
                disabled={pagination.pageIndex === totalPages}
                className={`px-3 py-1 rounded-md border ${
                    pagination.pageIndex === totalPages
                        ? "text-gray-400 border-gray-300"
                        : "text-blue-600 border-blue-400 hover:bg-blue-50"
                }`}
            >
                &gt;
            </button>
        </div>
    )
}