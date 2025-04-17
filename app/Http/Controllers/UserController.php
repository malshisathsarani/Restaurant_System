<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index()
    {
        try {
            // Get all users with their related businesses
            $users = User::with('businesses')->get();
            
            Log::info('Loading users list. Found ' . $users->count() . ' users.');
            
            return Inertia::render('Users/users', [
                'users' => $users
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading users: ' . $e->getMessage());
            
            return redirect()->route('dashboard')
                ->with('error', 'Failed to load users list.');
        }
    }
}