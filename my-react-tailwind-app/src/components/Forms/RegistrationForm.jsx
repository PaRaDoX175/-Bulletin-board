import {useMantineColorScheme} from "@mantine/core";
import {useForm} from "react-hook-form";

export default function RegistrationForm({ onClose }) {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    const {register,
        handleSubmit,
        formState: {errors}} = useForm({
        defaultValues: {
            displayName: "",
            email: "",
            password: "",
        }
    })

    const submitRegForm = async (data) => {
        const response = await fetch('http://localhost:5197/api/account/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const user = await response.json();
            localStorage.setItem('accessToken', user.accessToken)
            localStorage.setItem('displayName', user.displayName)
            onClose()
        }
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitRegForm)}>
            <input
                type="text"
                placeholder="Display name"
                {...register('displayName', {
                    required: "Enter your display name!"
                })}
                className={`p-3 rounded-lg border ${
                    dark
                        ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:border-blue-500"
                        : "bg-gray-100 border-gray-300 placeholder-gray-500 text-gray-900 focus:border-blue-500"
                } outline-none transition-colors`}
            />
            {errors.displayName && (
                <p className="text-red-500 text-sm">{errors.displayName.message}</p>
            )}
            <input
                type="email"
                placeholder="Email"
                {...register('email', {
                    required: "Enter your email address!",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
                })}
                className={`p-3 rounded-lg border ${
                    dark
                        ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:border-blue-500"
                        : "bg-gray-100 border-gray-300 placeholder-gray-500 text-gray-900 focus:border-blue-500"
                } outline-none transition-colors`}
            />
            {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <input
                type="password"
                placeholder="Password"
                {...register('password', {
                    required: "Enter your password!",
                    minLength: { value: 6, message: "Password must be at least 6 characters!" },
                })}
                className={`p-3 rounded-lg border ${
                    dark
                        ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:border-blue-500"
                        : "bg-gray-100 border-gray-300 placeholder-gray-500 text-gray-900 focus:border-blue-500"
                } outline-none transition-colors`}
            />
            {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
                Register
            </button>
        </form>
    )
}