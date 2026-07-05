<?php
use Illuminate\Http\Request;
use Illuminate\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::get('/products', [ProductController::class, 'index']);

// 認証済みユーザーのみアクセス可能なルート
// /api/userをauth:sanctumミドルウェアで保護
// Route::middleware("auth:sanctum")->get("/user", function(Request $request) {
//     return $request->user();
// });

Route::middleware("auth:sanctum")->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});