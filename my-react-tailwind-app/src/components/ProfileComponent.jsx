import Header from "./Header.jsx";
import {use, useEffect, useState} from "react";
import api from "../interceptors/tokenValidity.interceptor.jsx";
import {Link} from "react-router-dom";
import { LogOut, Edit3, User } from "lucide-react";
import Footer from "../components/Footer";
import AdListComponent from "./AdListComponent.jsx";
import {getDataWithInterceptor} from "../utils/requestService.js";
import {fileToDataUrl} from "../utils/fileToDataUrl.js";

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

    useEffect(() => {
        (async () => {
            const res = await api.get("/account/user_info");
            const data = res.data;
            setProfile({ displayName: data.displayName, email: data.email, pictureUrl: data.pictureUrl });
            setUserInfo({ displayName: data.displayName, email: data.email, pictureUrl: data.pictureUrl });
        })();
    }, []);

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("displayName");
        window.location.href = "/";
    };

    const saveChanges = async () => {
        // setProfile({ ...profile, displayName, email });
        setUserInfo({ ...profile });
        setEditing(false);
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

    useEffect(() => {
        (async() => {
            await fetchAds(pagination);
        })()
    }, [pagination]);

    const removeAd = async (adId) => {
        if (!confirm("Delete ad?")) return;
        await api.delete(`${baseUrl}/ads/delete_ad?adId=${adId}`)
        setPagination({...pagination})
    };

    // const submitImageUrl = async (url) => {
    //     const data = await
    // }

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

        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-700">
            <Header />

            <main className="flex-1 container mx-auto px-4 sm:px-8 py-10 sm:py-14 mt-10 sm:mt-16 max-w-7xl">
                <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-8 border-b pb-8">
                        <div className="relative self-center sm:self-auto">
                            <img
                                src={
                                    profile.pictureUrl ||
                                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                }
                                alt="Profile"
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-gray-200 object-cover shadow-md z-10"
                            />
                            <button
                                onClick={() => setOpenAvatar(true)}
                                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
                            >
                                <Edit3 size={20} />
                            </button>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                                {profile.displayName || "User"}
                            </h2>
                            <p className="text-gray-500 text-lg break-all">{profile.email}</p>

                            <div className="mt-5 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-base hover:bg-blue-700 transition shadow-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center gap-2 transition shadow-sm"
                                >
                                    <LogOut size={18} /> Exit
                                </button>
                            </div>
                        </div>
                    </div>

                    {editing && (
                        <div className="mt-8 space-y-5">
                            <div>
                                <label className="block text-base text-gray-600 mb-1">Display name</label>
                                <input
                                    value={userInfo.displayName}
                                    onChange={(e) => setUserInfo({ ...userInfo, displayName: e.target.value })}
                                    className="border rounded-lg w-full px-4 py-3 text-gray-700 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-base text-gray-600 mb-1">Email</label>
                                <input
                                    value={userInfo.email}
                                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                    className="border rounded-lg w-full px-4 py-3 text-gray-700 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-4">
                                <button
                                    onClick={() => setEditing(false)}
                                    className="px-6 py-2.5 rounded-lg border text-gray-700 hover:bg-gray-50 transition text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => updateUser(userInfo)}
                                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-base"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}

                    <section className="mt-12">
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 text-center sm:text-left">
                            My ads
                        </h3>
                        <div className="bg-gray-50 border rounded-2xl p-6 sm:p-8 text-gray-500 shadow-sm">
                            <AdListComponent
                                ads={ads}
                                pagination={pagination}
                                setPagination={setPagination}
                                removeAd={removeAd}
                                totalCount={totalCount}
                            />
                        </div>
                    </section>
                </div>
            </main>

            <Footer />

            {openAvatar && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
                        <button
                            onClick={() => setOpenAvatar(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            ✕
                        </button>

                        <div className="flex mb-8 bg-gray-100 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setIsUrl(true)}
                                className={`flex-1 py-2.5 text-lg font-medium transition ${
                                    isUrl ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                URL
                            </button>
                            <button
                                onClick={() => setIsUrl(false)}
                                className={`flex-1 py-2.5 text-lg font-medium transition ${
                                    !isUrl ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                File
                            </button>
                        </div>

                        <div className="space-y-5">
                            {isUrl ? (
                                <form className="flex flex-col gap-4" onSubmit={() => updateUser(userInfo)}>
                                    <input type="file" onChange={(e) => handleImageFile(e)} className="border rounded px-2 py-1 text-gray-700" />
                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
                                    >
                                        Save
                                    </button>
                                </form>
                            ) : (
                                <form className="flex flex-col gap-4" onSubmit={() => updateUser(userInfo)}>
                                    <input placeholder="https://..."  onChange={(e) => setUserInfo({...userInfo, pictureUrl: e.target.value})} className="flex-1 border rounded px-3 py-2 text-gray-700" />
                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
                                    >
                                        Save
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>


    );
}