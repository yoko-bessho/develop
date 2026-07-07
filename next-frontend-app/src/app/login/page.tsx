"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault(); //formのデフォルトのページリロード防止
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false, // 認証後の自動リダイレクト無効化
            });

            if (result?.error) {
                setError("メールアドレスまたはパスワードが正しくありません");
            } else {
                router.push("/"); // 認証成功後にトップページへリダイレクト
                router.refresh(); // 認証後にページをリフレッシュしてセッション情報を更新;
            }
        } catch (error) {
            setError("ログイン中にエラーが発生しました" + error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    ログイン
                </h1>

                {error && (
                    <div className="bg-red-100  border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            メールアドレス
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-indigo-500"
                            placeholder="example@example.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            パスワード
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:border-indigo-500"
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 px-4 py-2 font-medium text-white rounded-md hover:bg-indigo-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? "ログイン中..." : "ログイン"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    テストアカウント： test@example.com / password
                </p>
            </div>
        </div>
    );
}
