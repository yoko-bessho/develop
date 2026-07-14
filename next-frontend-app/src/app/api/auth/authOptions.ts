import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",//providerの名前
            // login画面で受け取る入力項目を定義
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "password", type: "password" },
            },
            // 入力された値を受け取り、認証を行う関数
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Laravel APIへログインリクエスト送信
                try {
                    const res = await fetch(
                        `${process.env.LARAVEL_API_BASE_URL}/api/login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                // サーバーに対してjsonでresponseを返すように指示
                                Accept: "application/json",
                            },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                        });

                    if (!res.ok) {
                        return null;
                    }

                    const data = await res.json();

                    return {
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        accessToken: data.token,
                    };
                } catch (error) {
                    console.error("Login errorです:", error);
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            // ログイン時に返されたユーザー情報をトークンに含める
            if (user) {
                token.accessToken = user.accessToken;
                token.id = user.id;
            }
            return token; // 返されたtokenは次のsessionコールバックに渡される
        },
        async session({ session, token }) {
            // JWTの情報をセッションに含める
            session.accessToken = token.accessToken;
            session.user.id = token.id;
            return session;
        },
    },
    pages: {
        signIn: "/login", //カスタムログインページのパス
        signOut: "/logout",
    },
};
