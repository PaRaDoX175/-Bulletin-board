import Header from "./Header.jsx";
import {useState} from "react";

export default function AuthenticateComponent({ onClose }) {
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

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    ✕
                </button>

                <div className="flex mb-8 bg-gray-100 rounded-xl overflow-hidden">
                    <button
                        onClick={() => setReg(false)}
                        className={`flex-1 py-2.5 text-lg font-medium transition ${
                            !reg ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setReg(true)}
                        className={`flex-1 py-2.5 text-lg font-medium transition ${
                            reg ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Registration
                    </button>
                </div>

                <div className="space-y-5">
                    {reg ? (
                        <form className="flex flex-col gap-4" onSubmit={submitRegForm}>
                            <input
                                type="text"
                                placeholder="Display name"
                                className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                onChange={(e) =>
                                    setRegForm({ ...regForm, displayName: e.target.value })
                                }
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                onChange={(e) =>
                                    setRegForm({ ...regForm, email: e.target.value })
                                }
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                onChange={(e) =>
                                    setRegForm({ ...regForm, password: e.target.value })
                                }
                            />
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
                            >
                                Sign up
                            </button>
                        </form>
                    ) : (
                        <form className="flex flex-col gap-4" onSubmit={submitLoginForm}>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                onChange={(e) =>
                                    setLoginForm({ ...loginForm, email: e.target.value })
                                }
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                onChange={(e) =>
                                    setLoginForm({ ...loginForm, password: e.target.value })
                                }
                            />
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
                            >
                                Log in
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>

    )
}