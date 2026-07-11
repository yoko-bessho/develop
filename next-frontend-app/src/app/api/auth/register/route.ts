import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const res = await fetch(`${process.env.LARAVEL_API_BASE_URL}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("Register errorです:", error);
        return NextResponse.json(
            { message: "登録処理中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
