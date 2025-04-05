<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Business;
use Illuminate\Support\Facades\Log;

class BusinessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $businesses = Business::all();
    
        return Inertia::render('Business/business', [
            'businesses' => $businesses
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Business/create', [
            'business' => new Business(),
        ]);
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBusinessRequest $request)
{
        // Create a new business instance; Form Request automatically validates so we use validated() to get the data.
        $validated = $request->validated();
    
        // Save the data to the database
        Business::create($validated);

        return redirect()->route('dashboard.business')->with('success', 'Business created successfully.');
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $business = Business::findOrFail($id);
            
            return Inertia::render('Business/show', [
                'business' => $business
            ]);
        } catch (\Exception $e) {
            return redirect()->route('dashboard.business')
                ->with('error', 'Business not found.');
        }
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $business = Business::findOrFail($id);
            
            return Inertia::render('Business/edit', [
                'business' => $business
            ]);
        } catch (\Exception $e) {
            return redirect()->route('dashboard.business')
                ->with('error', 'Business not found.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
{
    try {
        $business = Business::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|string|max:2000',
            'address' => 'required|string|max:1000',
        ]);
        
        $business->update($validated);
        
        return redirect()->route('dashboard.business')
            ->with('success', 'Business updated successfully.');
    } catch (\Exception $e) {
        // Log the error for debugging
        Log::error('Business update error: ' . $e->getMessage());
        
        return redirect()->back()
            ->withErrors(['error' => 'Failed to update business: ' . $e->getMessage()])
            ->withInput();
    }
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $business = Business::findOrFail($id);
            $businessName = $business->name;
            
            // Delete the business
            $business->delete();
            
            // Return a success response
            return redirect()->route('dashboard.business')
                ->with('success', "Business '$businessName' was deleted successfully.");
                
        } catch (\Exception $e) {
            // Log the error
            Log::error('Business deletion error: ' . $e->getMessage());
            
            // Return an error response
            return redirect()->route('dashboard.business')
                ->with('error', 'Failed to delete the business: ' . $e->getMessage());
        }
    }
}
