<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function show()
    {
        $this->authorize('viewAny', User::class);
        $users = User::all();
        return response()->json($users);
    }
}
