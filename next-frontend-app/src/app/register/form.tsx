"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                const message = data.errors
                    ? Object.values(data.errors).flat().join(" ")
                    : data.message ?? "登録に失敗しました";
                setError(message);
                return;
            }

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                router.push("/login");
                return;
            }

            router.push("/");
            router.refresh();
        } catch (err) {
            setError("登録中にエラーが発生しました" + err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md flex flex-col gap-4"
        >
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            <h1 className="text-2xl font-bold text-center mb-6">
                ユーザー登録
            </h1>
            <input
                className="border border-gray-300 rounded py-2 px-4"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
            />
            <input
                className="border border-gray-300 rounded py-2 px-4"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                className="border border-gray-300 rounded py-2 px-4"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <input
                className="border border-gray-300 rounded py-2 px-4"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Password (confirm)"
                required
            />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? "登録中..." : "登録"}
            </button>
        </form>
    );
}
