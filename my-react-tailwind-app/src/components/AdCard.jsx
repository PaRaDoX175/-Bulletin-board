import {useEffect, useState} from "react";
import { Phone, Mail, Trash2 } from "lucide-react";
import {jwtDecode} from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { useMantineColorScheme } from "@mantine/core";

export default function AdCard({ ad, onDelete }) {
    const [showContact, setShowContact] = useState(false);
    const [userId, setUserId] = useState('');
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            const decoded = jwtDecode(token)
            setUserId(decoded.nameid)
        }
        else setUserId('')
    }, [])

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`rounded-xl overflow-hidden shadow-lg border transition-colors duration-300 flex flex-col ${
                    dark
                        ? "bg-gray-900 border-gray-700 text-gray-100"
                        : "bg-white border-gray-200 text-gray-800"
                }`}
            >
                {ad.image ? (
                    <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-full h-48 object-cover"
                    />
                ) : (
                    <div
                        className={`w-full h-48 grid place-items-center text-sm ${
                            dark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"
                        }`}
                    >
                        No image
                    </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-semibold text-lg leading-tight">{ad.title}</h3>
                            <p
                                className={`text-sm ${
                                    dark ? "text-gray-400" : "text-gray-600"
                                }`}
                            >
                                {ad.category} • {ad.location}
                            </p>
                        </div>
                        <div
                            className={`text-xl font-bold ${
                                dark ? "text-blue-400" : "text-blue-600"
                            }`}
                        >
                            {ad.price ? `$${ad.price}` : "-"}
                        </div>
                    </div>

                    <p
                        className={`mt-2 text-sm flex-1 ${
                            dark ? "text-gray-300" : "text-gray-700"
                        } break-words`}
                    >
                        {ad.description?.slice(0, 120)}
                        {ad.description && ad.description.length > 120 ? "..." : ""}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
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

                        <div className="flex items-center gap-2 text-xs">
                            {ad.userId === userId && (
                                <button
                                    onClick={() => onDelete(ad.id)}
                                    className={`p-2 rounded-md transition-colors ${
                                        dark
                                            ? "text-red-400 hover:text-red-300 hover:bg-gray-800"
                                            : "text-red-500 hover:text-red-700 hover:bg-gray-100"
                                    }`}
                                    title="Delete ad"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <span className={dark ? "text-gray-500" : "text-gray-500"}>
                {new Date(ad.date).toLocaleDateString('ru-RU')}
              </span>
                        </div>
                    </div>
                </div>
            </motion.div>

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
                                className={`text-sm mb-1 ${
                                    dark ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                                {ad.seller}
                            </p>
                            <p
                                className={`text-sm mb-4 ${
                                    dark ? "text-gray-400" : "text-gray-600"
                                }`}
                            >
                                {ad.contact || "No contact provided"}
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
    );
}
