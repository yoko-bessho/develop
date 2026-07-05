<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Model\User;

Route::get('/', function () {
    return view('welcome');
});

// ログイン
Route::post("/login", function (Request $request) {
    $credentials = $request->validate([
        "email" => ["required", "email"],
        "password" => ["required"],
    ]);

    // Auth::attemptファサードを使い、fetch()postで送られたrequest（emailとpassword）で認証を試みる
    if (Auth::attempt($credentials)) {
        //認証成功したら新しいセッションIDを発行
        $request->session()->regenerate();
        
        return response()->json(Auth::user());
    }

    return response()->json([
        "message" => "The provided credentials do not match our records.",
    ], 401);
});

//ログアウト
Route::post("/logout", function (Request $request) {
    // セッションからユーザー情報を削除
    Auth::guard("web")->logout();
    // セッションを無効化
    $request->session()->invalidate();
    // セッション再生成
    $request->session()->regenerateToken();

    return response()->noContent();
});