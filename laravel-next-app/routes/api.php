<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;

//認証不要のルート
Route::get('/products', [ProductController::class, 'index']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// 認証済みユーザーのみアクセス可能なルート
// /api/userをauth:sanctumミドルウェアで保護
Route::middleware("auth:sanctum")->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [UserController::class, 'show']);
});
