<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\Component;
use App\Models\User;

class UserController extends Controller
{
    public function index(){
        $users = User::all();
        return response()->json(compact('users'),200);
    }

}
