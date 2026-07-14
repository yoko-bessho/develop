import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/authOptions";

// APIから返されるデータの型
interface User {
    id: number;
    name: string;
    email: string;
}

// fetchする非同期関数
async function getUsers(accessToken: string): Promise<User[] | null> {
    const url = `${process.env.LARAVEL_API_BASE_URL}/api/users`;
    console.log(`ユーザーをFetching data from: ${url}`); // デバッグ用にURLをログ出力

    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store", //開発中はcache無効で
    });
    console.log(`ユーザーのレスポンス: ${res.status} ${url} ${res.statusText}`); // デバッグ用にレスポンスをログ出力

    if (!res.ok) {
        // user_idが1のユーザー以外は403で拒否される
        return null;
    }

    return res.json();
}

// ユーザーカードのコンポーネント
function UserCard({ user }: { user: User }) {
    return (
        <div className="border rounded-lg shadow-md bg-white p-4">
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
        </div>
    );
}

// ユーザー一覧ページ（server component。user_idが1のユーザーのみ閲覧可）
export default async function UsersPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if (!session.accessToken) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-gray-600">ユーザー一覧を取得できませんでした。</p>
            </div>
        );
    }

    const users = await getUsers(session.accessToken);

    if (!users) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-gray-600">このページを閲覧する権限がありません。</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
                ユーザー一覧
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map((user) => (
                    <UserCard key={user.id} user={user}></UserCard>
                ))}
            </div>
        </div>
    );
}
