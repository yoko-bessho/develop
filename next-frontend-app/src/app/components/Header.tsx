"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
    const { data: session, status } = useSession();

    return (
        <header className="bg-white shadow">
            <div className="mx-w-7xl max-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-gray-800">
                    ECサイト
                </Link>

                <nav className="flex items-center gap-4">
                    <Link
                        href="/products"
                        className="text-gray-600 hover:text-gray-800"
                    >
                        商品一覧
                    </Link>

                    {status === "loading" ? (
                        <span className="text-gray-600">読み込み中...</span>
                    ) : session ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="text-gray-600 hover:text-gray-800"
                            >
                                ダッシュボード
                            </Link>
                            <Link
                                href="/users"
                                className="text-gray-600 hover:text-gray-800"
                            >
                                ユーザー一覧
                            </Link>
                            <span>{session.user?.name}さん</span>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="bg-gray-200 text-gray-700 px-4 py-2 font-medium rounded hover:bg-gray-300 transition-colors"
                            >
                                ログアウト
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-4 py-2 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
                        >
                            ログイン
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
