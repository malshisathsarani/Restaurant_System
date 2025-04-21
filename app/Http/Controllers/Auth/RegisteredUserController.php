<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Business;
use App\Providers\RouteServiceProvider;
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
            'business_name' => 'required|string|max:255',
        ]);

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Create business for admin users during registration
        if ($request->role === 'admin' && !empty($request->business_name)) {
            $businessName = trim($request->business_name);
            
            $business = Business::firstOrCreate(
                ['name' => $businessName],
                ['description' => 'Business created by ' . $user->name]
            );
            
            // Handle logo upload if provided
            if ($request->hasFile('logo')) {
                $path = $request->file('logo')->store('logos', 'public');
                $business->logo = $path;
                $business->save();
            }
            
            // Associate user with business
            $user->businesses()->attach($business->id);
            
            Log::info('Business created during registration', [
                'business_id' => $business->id,
                'business_name' => $business->name,
                'user_role' => $user->role,
                'has_logo' => $request->hasFile('logo')
            ]);
        }

        event(new Registered($user));

        Auth::login($user);
        // Redirect based on role
        if ($request->role === 'user') {
            // Regular users go to business creation page
            return redirect()->route('dashboard.userbusiness.create', [
                'businessName' => $request->business_name
            ]);
        }

        // Admins go directly to dashboard
        return redirect()->route('dashboard');
    }
}