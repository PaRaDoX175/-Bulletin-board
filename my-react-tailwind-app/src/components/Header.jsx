import { Menu, X, User, Plus, Sun, Moon, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, {useContext, useState} from "react";
import { ModalContext } from "../contexts/ModalContext.jsx";
import { isJwtValid } from "../utils/isJwtValid.js";
import { useMantineColorScheme } from "@mantine/core";

export default function Header({ saveOpenCreate, showCreate = true }) {
    const { openCreate, openAuthentication } = useContext(ModalContext);
    const navigate = useNavigate();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";
    const [menuOpen, setMenuOpen] = useState(false);

    const checkToken = () => {
        const isValid = isJwtValid(localStorage.getItem("accessToken"));
        if (isValid) {
            navigate("/profile");
        } else {
            openAuthentication();
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
                dark
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-white text-gray-900 shadow"
            }`}
        >
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded grid place-items-center font-bold text-lg">
                        B
                    </div>
                    <Link to="/">
                        <h1 className="text-xl font-semibold hover:text-blue-600 transition-colors duration-300">
                            Bulletin Board
                        </h1>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <Link to="/favorites">
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
                            <Heart size={18} className="fill-current text-white" />
                        </button>
                    </Link>
                    {showCreate && (
                        <button
                            onClick={() => openCreate(saveOpenCreate)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
                        >
                            <Plus size={18} /> Create
                        </button>
                    )}

                    <button
                        onClick={() => toggleColorScheme()}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {dark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <div>
                        {localStorage.getItem("pictureUrl") ? (
                            <div
                                onClick={checkToken}
                                className="w-8 h-8 bg-blue-600 text-white rounded-full grid place-items-center font-bold cursor-pointer hover:scale-105 transition-transform duration-200"
                            >
                                <img
                                    src={localStorage.getItem("pictureUrl")}
                                    alt=""
                                    className="rounded-full"
                                />
                            </div>
                        ) : localStorage.getItem("displayName") ? (
                            <div
                                onClick={checkToken}
                                className="w-8 h-8 bg-blue-600 text-white rounded-full grid place-items-center font-bold cursor-pointer hover:scale-105 transition-transform duration-200"
                            >
                                {localStorage.getItem("displayName")[0]}
                            </div>
                        ) : (
                            <User
                                onClick={openAuthentication}
                                className="cursor-pointer hover:text-blue-600 transition-colors duration-200"
                            />
                        )}
                    </div>
                </div>

                <div className="md:hidden flex items-center gap-3">
                    <button
                        onClick={() => toggleColorScheme()}
                        className="hidden md:block p-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
                    >
                        {dark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                    >
                        {menuOpen ? (
                            <X
                                size={26}
                                className="text-gray-600 dark:text-gray-300 transition-colors duration-300"
                            />
                        ) : (
                            <Menu
                                size={26}
                                className="text-gray-600 dark:text-gray-300 transition-colors duration-300"
                            />
                        )}
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div
                    className={`md:hidden flex flex-col gap-2 px-6 py-4 shadow-md border-t transition-colors duration-300 ${
                        dark
                            ? "bg-gray-900 text-white border-gray-700"
                            : "bg-white text-gray-900 border-gray-200"
                    }`}
                >
                    <div className="flex flex-col gap-3">
                        <Link
                            to="/favorites"
                            onClick={() => setMenuOpen(false)}
                            className="w-full"
                        >
                            <button
                                title="Favorites"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                <Heart size={18} />
                                <span>Favorites</span>
                            </button>
                        </Link>

                        {showCreate && (
                            <button
                                onClick={() => {
                                    openCreate(saveOpenCreate);
                                    setMenuOpen(false);
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                <Plus size={18} />
                                <span>Create</span>
                            </button>
                        )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

                    <div className="flex items-center justify-between">
                        {localStorage.getItem("pictureUrl") ? (
                            <div
                                onClick={() => {
                                    checkToken();
                                    setMenuOpen(false);
                                }}
                                className="w-10 h-10 bg-blue-600 text-white rounded-full grid place-items-center font-bold cursor-pointer hover:scale-105 transition-transform duration-200"
                            >
                                <img
                                    src={localStorage.getItem("pictureUrl")}
                                    alt=""
                                    className="rounded-full w-full h-full object-cover"
                                />
                            </div>
                        ) : localStorage.getItem("displayName") ? (
                            <div
                                onClick={() => {
                                    checkToken();
                                    setMenuOpen(false);
                                }}
                                className="w-10 h-10 bg-blue-600 text-white rounded-full grid place-items-center font-bold cursor-pointer hover:scale-105 transition-transform duration-200"
                            >
                                {localStorage.getItem("displayName")[0]}
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    openAuthentication();
                                    setMenuOpen(false);
                                }}
                                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600"
                            >
                                <User size={18} />
                                <span>Login</span>
                            </button>
                        )}

                        <button
                            onClick={() => toggleColorScheme()}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            {dark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

