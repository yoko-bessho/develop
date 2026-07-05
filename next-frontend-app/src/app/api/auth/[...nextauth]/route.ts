import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import "next-auth/jwt";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",//providerの名前
            // login画面で受け取る入力項目を定義
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "password", type: "password" },
            },
            // 入力された値を受け取り、認証を行う関数
            async authorize(credentials, req) {
                console.log(req.headers);

                // CSRFトークンとセッションクッキーを取得
                const csrfRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/sanctum/csrf-cookie`,
                );

                // getSetCookie()で全Set-Cookieを配列で取得（Node.js 18.14+）
                const setCookieEntries: string[] =
                    typeof (csrfRes.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === "function"
                        ? (csrfRes.headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
                        : [csrfRes.headers.get("set-cookie") ?? ""];

                // 各Set-Cookieからname=value部分のみ取り出す
                const cookiePairs = setCookieEntries
                    .map(entry => entry.split(";")[0].trim())
                    .filter(Boolean)
                    .join("; ");

                // XSRF-TOKEN値を抽出（X-XSRF-TOKENヘッダー用）
                const xsrfToken = setCookieEntries
                    .map(entry => entry.match(/XSRF-TOKEN=([^;]+)/)?.[1])
                    .find(Boolean) ?? "";

                console.log("[DEBUG] csrf status:", csrfRes.status);
                console.log("[DEBUG] setCookieEntries count:", setCookieEntries.length);
                console.log("[DEBUG] cookiePairs:", cookiePairs);
                console.log("[DEBUG] X-XSRF-TOKEN header:", decodeURIComponent(xsrfToken));

                // Laravel APIへログインリクエスト送信
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
                            Cookie: cookiePairs,
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    },
                );


                console.log("login status:", res.status);
                console.log("login set-cookie:", res.headers.get("set-cookie"));
                if (!res.ok) console.log("login body:", await res.clone().text());


                if (!res.ok) {
                    return null;
                }

                // ログインレスポンスの全Set-Cookieを取得
                const loginCookieEntries: string[] =
                    typeof (res.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === "function"
                        ? (res.headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
                        : [res.headers.get("set-cookie") ?? ""];

                // Max-Age=0（削除対象）のクッキーを除き、有効なクッキーだけを送る
                const loginCookiePairs = loginCookieEntries
                    .filter(entry => !/max-age=0/i.test(entry))
                    .map(entry => entry.split(";")[0].trim())
                    .filter(Boolean)
                    .join("; ");

                console.log("[DEBUG] loginCookiePairs:", loginCookiePairs);

                // user情報取得
                // Referer を付けることで Sanctum がセッション認証（SPA認証）として扱う
                const userRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
                    {
                        headers: {
                            Cookie: loginCookiePairs,
                            Referer: process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000",
                            Origin: process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000",
                        },
                    },
                );
                console.log("[DEBUG] userRes status:", userRes.status);

                if (!userRes.ok) {
                    return null;
                }

                const user = await userRes.json();

                // userオブジェクトを返す
                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // ログイン時に返されたユーザー情報をトークンに含める
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            // JsonWebTokenの情報をセッションに含める
            session.user = token.user;
            return session;
        },
    },
    pages: {
        signIn: "/login", //カスタムログインページのパス
        signOut: "/logout",
    },
});

export { handler as GET, handler as POST };