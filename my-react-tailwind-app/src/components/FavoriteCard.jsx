import {useMantineColorScheme} from "@mantine/core";
import {Heart, Phone} from "lucide-react";
import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

export default function FavoriteCard({ favorite, removeFavorite }) {
    const [showContact, setShowContact] = useState(false);

    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    return (
        <>
            <div
                className={`w-[80%] mx-auto my-4 p-5 rounded-2xl shadow-md transition-all hover:shadow-xl hover:scale-[1.01] 
        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex justify-between items-center`}
            >
                <div className="flex items-center gap-6">
                    <div className="w-[200px] h-40 rounded-xl overflow-hidden">
                        {favorite.image !== '' ? (
                            <img
                                src={favorite.image}
                                alt={favorite.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        ) : (
                            <div
                                className={`w-full h-full grid place-items-center text-sm ${
                                    dark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"
                                }`}
                            >
                                No image
                            </div>
                        )}

                    </div>

                    <div className="flex flex-col justify-between h-40 py-1">
                        <div>
                            <h2 className="text-xl font-semibold mb-1 dark:text-gray-100">
                                {favorite.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 max-w-[400px]">
                                {favorite.description || "No description available"}
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            {favorite.city}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between h-40 py-1">
                    <div className='flex justify-between gap-5'>
                        <button
                            onClick={() => setShowContact(true)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                                dark
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                        >
                            <Phone size={14} />
                            Contact
                        </button>
                        <button
                            onClick={removeFavorite}
                            className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 transition"
                            title="Remove from favorites"
                        >
                            <Heart className="text-red-500 fill-red-500" size={20} />
                        </button>
                    </div>

                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        ${favorite.price}
                    </div>
                </div>


            </div>
            <AnimatePresence>
                {showContact && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm grid place-items-center z-50 p-4"
                        onClick={() => setShowContact(false)}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`rounded-2xl p-6 w-full max-w-sm shadow-xl border transition-colors duration-300 ${
                                dark
                                    ? "bg-gray-900 border-gray-700 text-gray-100"
                                    : "bg-white border-gray-200 text-gray-800"
                            }`}
                        >
                            <h3 className="text-lg font-semibold mb-2">Contact Seller</h3>

                            <p
                                className={`text-sm mb-4 ${
                                    dark ? "text-gray-400" : "text-gray-600"
                                }`}
                            >
                                {favorite.city || "No contact provided"}
                            </p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowContact(false)}
                                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                                        dark
                                            ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>

    )
}