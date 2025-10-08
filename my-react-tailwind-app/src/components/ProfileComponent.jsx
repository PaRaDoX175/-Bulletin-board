import Header from "./Header.jsx";
import {useEffect, useState} from "react";
import api from "../interceptors/tokenValidity.interceptor.jsx";
import {Link} from "react-router-dom";

export default function ProfileComponent() {
    const [profile, setProfile] = useState({});

    useEffect(() => {
        (async () => {
            const p = await api.get('/account/user_info')
            setProfile(p.data)
        })()

    }, []);

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("displayName");
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-700">
            <Header />

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="md:flex md:items-center md:gap-6 p-6 md:p-8">
                    <div className="bg-white rounded-lg shadow p-35 w-full max-w-2xl mx-auto ">
                        <div className="flex items-center gap-4">
                            <img
                                alt="Profile"
                                className="w-24 h-24 rounded-full border"
                            />
                            <div>
                                <label className="block text-sm text-gray-600">Имя</label>
                                <input
                                    type="text"
                                    defaultValue={profile.displayName}
                                    className="border rounded px-3 py-2 w-60 text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600">Email</label>
                                <input
                                    type="email"
                                    defaultValue={profile.email}
                                    className="border rounded px-3 py-2 w-full text-gray-700"
                                />
                            </div>
                            {/*<div>*/}
                            {/*    <label className="block text-sm text-gray-600">Телефон</label>*/}
                            {/*    <input*/}
                            {/*        type="tel"*/}
                            {/*        defaultValue="+7 707 123 45 67"*/}
                            {/*        className="border rounded px-3 py-2 w-full text-gray-700"*/}
                            {/*    />*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <label className="block text-sm text-gray-600">Город</label>*/}
                            {/*    <input*/}
                            {/*        type="text"*/}
                            {/*        defaultValue="Алматы"*/}
                            {/*        className="border rounded px-3 py-2 w-full text-gray-700"*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Link to={"/"}>
                                <button className="px-4 py-2 rounded border text-gray-700 hover:red" onClick={logout}>
                                    Logout
                                </button>
                            </Link>

                            <button className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50">
                                Отмена
                            </button>
                            <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                                Сохранить
                            </button>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    )
}