import { useState, useRef } from "react";
import { categories } from "../data/categories";
import {fileToDataUrl} from "../utils/fileToDataUrl.js";
import { motion } from "framer-motion";
import {useMantineColorScheme} from "@mantine/core";

export default function CreateAdModal({ onClose, onAdCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Electronics");
    const [location, setLocation] = useState("");
    const [contact, setContact] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const baseUrl = 'http://localhost:5197/api'

    const fileRef = useRef();

    const {colorScheme} = useMantineColorScheme();
    const dark = colorScheme === "dark";

    const submit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert("Add title");
            return;
        }

        let img;

        if (imageUrl === null && imageFile === null) img = null;
        else if (imageUrl === null) img = imageFile;
        else img = imageUrl;

        const ad = {
            title,
            description,
            price,
            category,
            location,
            contact,
            imageUrl: img,
        }

        console.log(ad);

        await addAdToDb(ad)
        if (onAdCreated) onAdCreated();
        onClose()
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(await fileToDataUrl(file));
    };

    const addAdToDb = async (ad) => {

        const adToDb = {
            title: ad.title,
            description: ad.description,
            price: ad.price,
            category: ad.category,
            location: ad.location,
            contact: ad.contact,
            image: ad.imageUrl,
        }

        try {
            await fetch(baseUrl + '/ads/add', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify(adToDb)
            })

        } catch {
            console.log('smth went wrong')
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`w-full max-w-2xl rounded-2xl shadow-2xl p-6 border transition-colors duration-300 ${
                    dark
                        ? "bg-gray-900 border-gray-700 text-gray-100"
                        : "bg-white border-gray-200 text-gray-800"
                }`}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Create Advertisement</h2>
                    <button
                        onClick={onClose}
                        className={`text-2xl font-bold px-2 hover:rotate-90 transition-transform ${
                            dark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
                        }`}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full rounded-lg px-3 py-2 border focus:ring-2 outline-none ${
                                dark
                                    ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                                    : "bg-gray-50 border-gray-300 focus:ring-blue-400"
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`w-full rounded-lg px-3 py-2 h-28 border focus:ring-2 outline-none ${
                                dark
                                    ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                                    : "bg-gray-50 border-gray-300 focus:ring-blue-400"
                            }`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Price (USD)</label>
                            <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                className={`w-full rounded-lg px-3 py-2 border focus:ring-2 outline-none ${
                                    dark
                                        ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                                        : "bg-gray-50 border-gray-300 focus:ring-blue-400"
                                }`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={`w-full rounded-lg px-3 py-2 border focus:ring-2 outline-none ${
                                    dark
                                        ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                                        : "bg-gray-50 border-gray-300 focus:ring-blue-400"
                                }`}
                            >
                                {categories.slice(1).map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={`w-full rounded-lg px-3 py-2 border focus:ring-2 outline-none ${
                                    dark
                                        ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                                        : "bg-gray-50 border-gray-300 focus:ring-blue-400"
                                }`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Contact (phone/email)
                            </label>
                            <input
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                className={`w-full rounded-lg px-3 py-2 border focus:ring-2 outline-none ${
                                    dark
                                        ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                                        : "bg-gray-50 border-gray-300 focus:ring-blue-400"
                                }`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Picture (file) or URL
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="file"
                                ref={fileRef}
                                onChange={(e) => handleFileChange(e)}
                                className={`border rounded-lg px-2 py-1 text-sm cursor-pointer ${
                                    dark
                                        ? "bg-gray-800 border-gray-700 text-gray-300"
                                        : "bg-gray-50 border-gray-300 text-gray-700"
                                }`}
                            />
                            <input
                                placeholder="https://..."
                                value={imageUrl === null ? "" : imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className={`flex-1 rounded-lg px-3 py-2 border focus:ring-2 outline-none ${
                                    dark
                                        ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                                        : "bg-gray-50 border-gray-300 focus:ring-blue-400"
                                }`}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                                dark
                                    ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-5 py-2 rounded-lg font-semibold shadow transition-all ${
                                dark
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );

}
