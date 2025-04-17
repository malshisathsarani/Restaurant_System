<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Business;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,user',
            'business_name' => 'required_if:role,admin|string|max:255',
        ]);

        // Log what's coming in from the form
        Log::info('Registration data', [
            'business_name' => $request->business_name,
            'role' => $request->role
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Create business if admin user
        if ($request->role === 'admin' && !empty($request->business_name)) {
            // Use firstOrCreate to prevent duplicate business names
            // Make sure we're using the exact value from the request
            $businessName = trim($request->business_name);
            
            $business = Business::firstOrCreate(
                ['name' => $businessName],
                ['description' => 'Business created by ' . $user->name]
            );
            
            // Associate user with business
            $user->businesses()->attach($business->id);
            
            // Log the business that was created
            Log::info('Business created', [
                'business_id' => $business->id,
                'business_name' => $business->name
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}