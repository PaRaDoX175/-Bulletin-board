import Header from "./Header.jsx";
import {useState} from "react";
import {useMantineColorScheme} from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import {useForm} from "react-hook-form";
import RegistrationForm from "./Forms/RegistrationForm.jsx";
import LoginForm from "./Forms/LoginForm.jsx";

export default function AuthenticateComponent({ onClose }) {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    const [reg, setReg] = useState(true);

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
                            <RegistrationForm onClose={onClose}></RegistrationForm>
                        ) : (
                            <LoginForm onClose={onClose}></LoginForm>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>

    )
}