import { useMantineColorScheme } from "@mantine/core";

export default function Pagination({ pagination, setPagination, totalCount }) {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

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
    const baseButton = "px-3 py-1 rounded-md border transition-colors duration-200 text-sm";

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() =>
                    setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })
                }
                disabled={pagination.pageIndex === 1}
                className={`${baseButton} ${
                    pagination.pageIndex === 1
                        ? dark
                            ? "text-gray-500 border-gray-700"
                            : "text-gray-400 border-gray-300"
                        : dark
                            ? "text-blue-400 border-blue-500 hover:bg-blue-500/10"
                            : "text-blue-600 border-blue-400 hover:bg-blue-50"
                }`}
            >
                &lt;
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => setPagination({ ...pagination, pageIndex: page })}
                    className={`${baseButton} ${
                        page === pagination.pageIndex
                            ? dark
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-blue-600 text-white border-blue-600"
                            : dark
                                ? "text-blue-400 border-blue-500 hover:bg-blue-500/10"
                                : "text-blue-600 border-blue-400 hover:bg-blue-50"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() =>
                    setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })
                }
                disabled={pagination.pageIndex === totalPages}
                className={`${baseButton} ${
                    pagination.pageIndex === totalPages
                        ? dark
                            ? "text-gray-500 border-gray-700"
                            : "text-gray-400 border-gray-300"
                        : dark
                            ? "text-blue-400 border-blue-500 hover:bg-blue-500/10"
                            : "text-blue-600 border-blue-400 hover:bg-blue-50"
                }`}
            >
                &gt;
            </button>
        </div>
    );
}