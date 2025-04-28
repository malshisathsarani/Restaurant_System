<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Business;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserBusinessController extends Controller
{
    public function index()
    {
        // Get businesses associated with current user
        $user = Auth::user();
        // Using fresh() to ensure we get the latest data
        $businesses = $user->businesses()->get()->fresh();
        
        return Inertia::render('UserSide/UserBusiness/dashboard', [
            'businesses' => $businesses
        ]);
    }
    
    public function create(Request $request)
    {
        $businessId = $request->query('business_id', null);

        $businesses = Business::all();

        $businessId = $request->session()->get('active_business_id');

        return Inertia::render('UserSide/UserBusiness/create', [
            'businessName' => $request->query('businessName')
        ]);
    }
    
    public function store(Request $request)
{
    $request->validate([
        'business_action' => 'required|in:create,join',
        'business_name' => 'required_if:business_action,create|string|max:255',
        'description' => 'nullable|string|max:1000',
        'logo' => 'nullable|image|max:1024', // 1MB max
        'address' => 'required|string', // Added address validation
        'business_id' => 'required_if:business_action,join|exists:businesses,id',
    ]);

    $user = Auth::user();
    
    if ($request->business_action === 'create') {
        // Create a new business
        $business = Business::create([
            'name' => $request->business_name,
            'description' => $request->description ?? 'Business created by ' . $user->name,
            'address' => $request->address,
        ]);
        
        // Handle logo upload if provided
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $business->logo = $path;
            $business->save();
        }
        
        // Attach the user to the business
        $user->businesses()->attach($business->id);
        
        Log::info('Business created by user', [
            'business_id' => $business->id,
            'business_name' => $business->name,
            'user_id' => $user->id,
            'has_logo' => $request->hasFile('logo')
        ]);
    } else {
        // Join existing business
        $business = Business::findOrFail($request->business_id);
        $user->businesses()->attach($business->id);
        
        Log::info('User joined existing business', [
            'business_id' => $business->id,
            'business_name' => $business->name,
            'user_id' => $user->id
        ]);
    }
   
    // Return success response for Inertia to handle
    return redirect()->route('dashboard')
        ->with('success', 'Business setup completed successfully!');
}
    
    public function show($id)
    {
        $business = Business::findOrFail($id);
        $user = Auth::user();
        
        // Check if user has access to this business
        if (!$user->businesses->contains($business->id)) {
            abort(403, 'Unauthorized access to this business');
        }
        
        return Inertia::render('UserSide/UserBusiness/dashboard', [
            'business' => $business
        ]);
    }
    
    public function edit($id)
    {
        $business = Business::findOrFail($id);
        $user = Auth::user();
        
        // Check if user has access to this business
        if (!$user->businesses->contains($business->id)) {
            abort(403, 'Unauthorized access to this business');
        }
        
        return Inertia::render('UserSide/UserBusiness/edit', [
            'business' => $business
        ]);
    }
    
    public function update(Request $request, $id)
    {
        $business = Business::findOrFail($id);
        $user = Auth::user();
        
        // Check if user has access to this business
        if (!$user->businesses->contains($business->id)) {
            abort(403, 'Unauthorized access to this business');
        }
        
        $request->validate([
            'business_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'logo' => 'nullable|image|max:1024', // 1MB max
            'address' => 'required|string|max:500',
        ]);
        
        $business->update([
            'name' => $request->business_name,
            'description' => $request->description,
            'address' => $request->address,
        ]);
        
        if ($request->hasFile('logo')) {
            // Remove old logo if exists
            if ($business->logo && Storage::disk('public')->exists($business->logo)) {
                Storage::disk('public')->delete($business->logo);
            }
            
            $path = $request->file('logo')->store('logos', 'public');
            $business->logo = $path;
            $business->save();
        }
        
        return redirect()->route('dashboard.userbusiness')
            ->with('success', 'Business updated successfully');
    }
    
    public function destroy($id)
    {
        $business = Business::findOrFail($id);
        $user = Auth::user();
        
        // Check if user has access to this business
        if (!$user->businesses->contains($business->id)) {
            abort(403, 'Unauthorized access to this business');
        }
        
        // Just detach the user from this business
        $user->businesses()->detach($business->id);
        
        return redirect()->route('dashboard.userbusiness')
            ->with('success', 'Successfully removed from business');
    }
    
    // For onboarding routes
    public function showBusinessForm()
    {
        // Get all businesses to allow the user to select an existing one
        $businesses = Business::all();
        
        return Inertia::render('UserSide/UserBusiness/create', [
            'businesses' => $businesses,
            'auth' => ['user' => Auth::user()]
        ]);
    }
    
    public function setupBusiness(Request $request)
    {
        // Same as store method
        return $this->store($request);
    }
}