import Header from "./Header.jsx";
import {use, useEffect, useState} from "react";
import api from "../interceptors/tokenValidity.interceptor.jsx";
import {Link} from "react-router-dom";
import { LogOut, Edit3, User } from "lucide-react";
import Footer from "../components/Footer";
import AdListComponent from "./AdListComponent.jsx";
import {getDataWithInterceptor} from "../utils/requestService.js";
import {fileToDataUrl} from "../utils/fileToDataUrl.js";
import {useMantineColorScheme} from "@mantine/core";
import { motion } from "framer-motion";

export default function ProfileComponent() {
    const [profile, setProfile] = useState({
        displayName: '',
        email: '',
        pictureUrl: ''
    });
    const [editing, setEditing] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 6
    })
    const [userInfo, setUserInfo] = useState({
        displayName: '',
        email: '',
        pictureUrl: ''
    });
    const [ads, setAds] = useState([]);
    const [openAvatar, setOpenAvatar] = useState(false);
    const [isUrl, setIsUrl] = useState(true);
    const baseUrl = 'http://localhost:5197/api';

    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    useEffect(() => {
        (async () => {
            const res = await api.get("/account/user_info");
            const data = res.data;
            setProfile({ displayName: data.displayName, email: data.email, pictureUrl: data.pictureUrl });
            setUserInfo({ displayName: data.displayName, email: data.email, pictureUrl: data.pictureUrl });
        })();
    }, []);

    useEffect(() => {
        (async() => {
            await fetchAds(pagination);
        })()
    }, [pagination]);

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("displayName");
        localStorage.removeItem("pictureUrl");
        window.location.href = "/";
    };

    const fetchAds = async (params = {}) => {
        const query = new URLSearchParams({
            pageIndex: params.pageIndex ?? 1,
            pageSize: params.pageSize ?? 6
        })

        try {
            let data = await getDataWithInterceptor(baseUrl + `/ads/get_user_ads?${query.toString()}`)

            setTotalCount(data.count)
            setAds(data.data);
        }
        catch {
            console.log('smth went wrong')
        }
    }

    const removeAd = async (adId) => {
        if (!confirm("Delete ad?")) return;
        await api.delete(`${baseUrl}/ads/delete_ad?adId=${adId}`)
        setPagination({...pagination})
    };

    const handleImageFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUserInfo({...userInfo, pictureUrl: await fileToDataUrl(file)});
    };

    const updateUser = async (userInfo) => {
        const req = await api.put(`${baseUrl}/user/update_user`, userInfo)

        setProfile({ ...req.data })
        setUserInfo({...req.data})
        setEditing(false);
    }

    return (
        <div
            className={`min-h-screen flex flex-col transition-colors duration-300 ${
                dark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
            }`}
        >
            <Header saveOpenCreate={() => fetchAds(pagination)}/>

            <main className="flex-1 container mx-auto px-4 sm:px-8 py-10 sm:py-14 mt-10 sm:mt-16 max-w-7xl">
                <div
                    className={`rounded-3xl shadow-2xl p-6 sm:p-10 border transition-colors duration-300 ${
                        dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                    }`}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-8 border-b pb-8 border-gray-300/40">
                        <div className="relative self-center sm:self-auto">
                            <img
                                src={
                                    profile.pictureUrl ||
                                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                }
                                alt="Profile"
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-gray-200 object-cover shadow-md"
                            />
                            <button
                                onClick={() => setOpenAvatar(true)}
                                className={`absolute bottom-2 right-2 p-2 rounded-full shadow-md transition-all ${
                                    dark
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                            >
                                <Edit3 size={20} />
                            </button>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl sm:text-3xl font-semibold">
                                {profile.displayName || "User"}
                            </h2>
                            <p className="text-gray-500 text-lg break-all">{profile.email}</p>

                            <div className="mt-5 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                                <button
                                    onClick={() => setEditing(true)}
                                    className={`px-6 py-2.5 rounded-lg font-semibold shadow transition-all ${
                                        dark
                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                            : "bg-blue-500 hover:bg-blue-600 text-white"
                                    }`}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={logout}
                                    className={`px-6 py-2.5 rounded-lg border font-medium flex items-center justify-center gap-2 transition-colors ${
                                        dark
                                            ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <LogOut size={18} /> Exit
                                </button>
                            </div>
                        </div>
                    </div>

                    {editing && (
                        <div className="mt-8 space-y-5">
                            <div>
                                <label className="block text-base mb-1">Display name</label>
                                <input
                                    value={userInfo.displayName}
                                    onChange={(e) =>
                                        setUserInfo({ ...userInfo, displayName: e.target.value })
                                    }
                                    className={`w-full rounded-lg px-4 py-3 border text-lg focus:ring-2 outline-none ${
                                        dark
                                            ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                                            : "bg-gray-50 border-gray-300 focus:ring-blue-400"
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block text-base mb-1">Email</label>
                                <input
                                    value={userInfo.email}
                                    onChange={(e) =>
                                        setUserInfo({ ...userInfo, email: e.target.value })
                                    }
                                    className={`w-full rounded-lg px-4 py-3 border text-lg focus:ring-2 outline-none ${
                                        dark
                                            ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                                            : "bg-gray-50 border-gray-300 focus:ring-blue-400"
                                    }`}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-3">
                                <button
                                    onClick={() => setEditing(false)}
                                    className={`px-6 py-2.5 rounded-lg border font-medium transition-colors ${
                                        dark
                                            ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => updateUser(userInfo)}
                                    className={`px-6 py-2.5 rounded-lg font-semibold shadow transition-all ${
                                        dark
                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                            : "bg-blue-500 hover:bg-blue-600 text-white"
                                    }`}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}

                    <section className="mt-12">
                        <h3 className="text-xl sm:text-2xl font-semibold mb-5 text-center sm:text-left">
                            My ads
                        </h3>
                        <div
                            className={`rounded-2xl border shadow-sm p-6 sm:p-8 transition-colors ${
                                dark
                                    ? "bg-gray-800 border-gray-700 text-gray-300"
                                    : "bg-gray-50 border-gray-200 text-gray-600"
                            }`}
                        >
                            <AdListComponent
                                ads={ads}
                                pagination={pagination}
                                setPagination={setPagination}
                                removeAd={removeAd}
                                totalCount={totalCount}
                                isMine={true}
                            />
                        </div>
                    </section>
                </div>
            </main>

            <Footer />

            {openAvatar && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`rounded-3xl shadow-2xl w-full max-w-md p-8 relative border transition-colors duration-300 ${
                            dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                        }`}
                    >
                        <button
                            onClick={() => setOpenAvatar(false)}
                            className={`absolute top-2 right-2 text-2xl font-bold px-2 transition-transform hover:rotate-90 ${
                                dark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
                            }`}
                        >
                            ×
                        </button>

                        <div className="flex mb-8 rounded-xl overflow-hidden border border-blue-900">
                            <button
                                onClick={() => setIsUrl(true)}
                                className={`flex-1 py-2.5 text-lg font-medium transition ${
                                    isUrl
                                        ? dark
                                            ? "bg-blue-600 text-white"
                                            : "bg-blue-500 text-white"
                                        : dark
                                            ? "text-gray-300 hover:bg-gray-800"
                                            : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                File
                            </button>
                            <button
                                onClick={() => setIsUrl(false)}
                                className={`flex-1 py-2.5 text-lg font-medium transition ${
                                    !isUrl
                                        ? dark
                                            ? "bg-blue-600 text-white"
                                            : "bg-blue-500 text-white"
                                        : dark
                                            ? "text-gray-300 hover:bg-gray-800"
                                            : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                Url
                            </button>
                        </div>

                        <div className="space-y-5">
                            {isUrl ? (
                                <form className="flex flex-col gap-4" onSubmit={() => updateUser(userInfo)}>
                                    <input
                                        type="file"
                                        onChange={(e) => handleImageFile(e)}
                                        className={`border rounded-lg px-2 py-1 text-sm cursor-pointer ${
                                            dark
                                                ? "bg-gray-800 border-gray-700 text-gray-300"
                                                : "bg-gray-50 border-gray-300 text-gray-700"
                                        }`}
                                    />
                                    <button
                                        type="submit"
                                        className={`w-full py-3 rounded-lg font-semibold shadow transition-all ${
                                            dark
                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                        }`}
                                    >
                                        Save
                                    </button>
                                </form>
                            ) : (
                                <form className="flex flex-col gap-4" onSubmit={() => updateUser(userInfo)}>
                                    <input
                                        placeholder="https://..."
                                        onChange={(e) =>
                                            setUserInfo({ ...userInfo, pictureUrl: e.target.value })
                                        }
                                        className={`flex-1 rounded-lg px-3 py-2 border focus:ring-2 outline-none ${
                                            dark
                                                ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                                                : "bg-gray-50 border-gray-300 focus:ring-blue-400"
                                        }`}
                                    />
                                    <button
                                        type="submit"
                                        className={`w-full py-3 rounded-lg font-semibold shadow transition-all ${
                                            dark
                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                        }`}
                                    >
                                        Save
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );

}