import { useMantineColorScheme } from "@mantine/core";

export default function Footer() {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    return (
        <footer
            className={`mt-auto border-t transition-colors duration-300 ${
                dark
                    ? "bg-gray-900 border-gray-700 text-gray-400"
                    : "bg-gray-50 border-gray-200 text-gray-600"
            }`}
        >
            <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
                <div>
                    &copy; {new Date().getFullYear()} Almaty. Project for IITU Web Technology.
                </div>
                <div className="flex gap-4 flex-wrap justify-center md:justify-end">
                    <span>Ruslan Absalyamov</span>
                    <span>Kim Eduard</span>
                    <span>Kozhanov Abdualim</span>
                </div>
            </div>
        </footer>
    );
}
