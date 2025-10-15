import Header from "./Header.jsx";
import {useState} from "react";
import {useMantineColorScheme} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthenticateComponent({ onClose }) {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    const [reg, setReg] = useState(true);
    const [regForm, setRegForm] = useState({
        displayName: "",
        email: "",
        password: "",
    })
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })
    const baseUrl = 'http://localhost:5197/api/account'


    const submitRegForm = async (e) => {
        e.preventDefault();
        if (regForm.displayName !== "" && regForm.email !== "" && regForm.password !== "") {
            const response = await fetch(baseUrl + '/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(regForm)
            })

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem('accessToken', user.accessToken)
                localStorage.setItem('displayName', user.displayName)
                onClose()
            }
        }
    }

    const submitLoginForm = async (e) => {
        e.preventDefault();
        if (loginForm.email !== "" && loginForm.password !== "") {
            const response = await fetch(baseUrl + '/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(loginForm)
            })

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem('accessToken', user.accessToken)
                localStorage.setItem('displayName', user.displayName)
                onClose()
            }
        }
    }


    return (

        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm grid place-items-center z-50 p-4"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${
                        dark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                    }`}
                >
                    <button
                        onClick={onClose}
                        className={`mb-4 px-3 py-1 rounded-md border ${
                            dark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"
                        } transition-colors`}
                    >
                        Exit
                    </button>

                    <div className="flex justify-between mb-6 gap-2">
                        <button
                            onClick={() => setReg(true)}
                            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                                reg
                                    ? "bg-blue-600 text-white shadow-md"
                                    : dark
                                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Registration
                        </button>
                        <button
                            onClick={() => setReg(false)}
                            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                                !reg
                                    ? "bg-blue-600 text-white shadow-md"
                                    : dark
                                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            Login
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {reg ? (
                            <form className="flex flex-col gap-4" onSubmit={submitRegForm}>
                                <input
                                    type="text"
                                    placeholder="Display name"
                                    value={regForm.displayName}
                                    onChange={(e) =>
                                        setRegForm({ ...regForm, displayName: e.target.value })
                                    }
                                    className={`p-3 rounded-lg border ${
                                        dark
                                            ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:border-blue-500"
                                            : "bg-gray-100 border-gray-300 placeholder-gray-500 text-gray-900 focus:border-blue-500"
                                    } outline-none transition-colors`}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={regForm.email}
                                    onChange={(e) =>
                                        setRegForm({ ...regForm, email: e.target.value })
                                    }
                                    className={`p-3 rounded-lg border ${
                                        dark
                                            ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:border-blue-500"
                                            : "bg-gray-100 border-gray-300 placeholder-gray-500 text-gray-900 focus:border-blue-500"
                                    } outline-none transition-colors`}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={regForm.password}
                                    onChange={(e) =>
                                        setRegForm({ ...regForm, password: e.target.value })
                                    }
                                    className={`p-3 rounded-lg border ${
                                        dark
                                            ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:border-blue-500"
                                            : "bg-gray-100 border-gray-300 placeholder-gray-500 text-gray-900 focus:border-blue-500"
                                    } outline-none transition-colors`}
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                >
                                    Register
                                </button>
                            </form>
                        ) : (
                            <form className="flex flex-col gap-4" onSubmit={submitLoginForm}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={loginForm.email}
                                    onChange={(e) =>
                                        setLoginForm({ ...loginForm, email: e.target.value })
                                    }
                                    className={`p-3 rounded-lg border ${
                                        dark
                                            ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:border-blue-500"
                                            : "bg-gray-100 border-gray-300 placeholder-gray-500 text-gray-900 focus:border-blue-500"
                                    } outline-none transition-colors`}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={loginForm.password}
                                    onChange={(e) =>
                                        setLoginForm({ ...loginForm, password: e.target.value })
                                    }
                                    className={`p-3 rounded-lg border ${
                                        dark
                                            ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:border-blue-500"
                                            : "bg-gray-100 border-gray-300 placeholder-gray-500 text-gray-900 focus:border-blue-500"
                                    } outline-none transition-colors`}
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                >
                                    Login
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>

    )
}