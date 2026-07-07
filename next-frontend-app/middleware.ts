import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login", // カスタムのログインページのURLを指定する
    }
});

export const config = {
    matcher: ["dashboard/:path*", "/profile/:path*"],// このurlを認証が必要なページとして指定する
};