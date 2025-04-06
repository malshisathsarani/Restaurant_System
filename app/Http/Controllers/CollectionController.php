<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Business;
use App\Http\Requests\StoreCollectionRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $collections = Collection::with('business')->get(); // optional: eager load business if needed
    
        return Inertia::render('Collection/collection', [
            'collections' => $collections
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get all businesses to populate the dropdown
        $collections = Collection::with('business')->get();

        return Inertia::render('Collection/create', [
            'collections' => $collections
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCollectionRequest $request)
    {
        // Validate and get data
        $validated = $request->validated();
        
        // Create collection
        Collection::create($validated);
        
        return redirect()->route('dashboard.collection')
                        ->with('success', 'Collection created successfully.');
    }

    /**
     * Display the specified resource.
     */
/**
 * Display the specified resource.
 */
public function show(string $id)
{
    try {
        $collection = Collection::with('business')->findOrFail($id);
        
        // Debug output
        Log::info("Found collection: {$collection->name} with ID: {$id}");
        
        return Inertia::render('Collection/show', [
            'collection' => $collection
        ]);
    } catch (\Exception $e) {
        Log::error("Error finding collection {$id}: " . $e->getMessage());
        return redirect()->route('dashboard.collection')
                      ->with('error', 'Collection not found');
    }
}
    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            // Get the collection with related business
            $collection = Collection::with('business')->findOrFail($id);
            
            // Get all businesses for the dropdown
            $businesses = Business::all();
            
            // Log for debugging
            Log::info("Loading edit form for collection ID: {$id}");
            
            return Inertia::render('Collection/edit', [
                'collection' => $collection,
                'businesses' => $businesses
            ]);
        } catch (\Exception $e) {
            Log::error("Error loading edit form for collection {$id}: " . $e->getMessage());
            
            return redirect()->route('dashboard.collection')
                             ->with('error', 'Collection not found.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $collection = Collection::findOrFail($id);
            
            $validated = $request->validate([
                'business_id' => 'required|exists:businesses,id',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'active' => 'boolean'
            ]);
            
            $collection->update($validated);
            
            return redirect()->route('dashboard.collection')
                            ->with('success', 'Collection updated successfully.');
        } catch (\Exception $e) {
            Log::error('Collection update error: ' . $e->getMessage());
            
            return redirect()->back()
                            ->withErrors(['error' => 'Failed to update collection: ' . $e->getMessage()])
                            ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $collection = Collection::findOrFail($id);
            $collectionName = $collection->name;
            
            // Delete the collection
            $collection->delete();
            
            return redirect()->route('dashboard.collection')
                            ->with('success', "Collection '$collectionName' was deleted successfully.");
                            
        } catch (\Exception $e) {
            Log::error('Collection deletion error: ' . $e->getMessage());
            
            return redirect()->route('dashboard.collection')
                            ->with('error', 'Failed to delete the collection: ' . $e->getMessage());
        }
    }
}
