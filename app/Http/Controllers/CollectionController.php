<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Business;
use App\Http\Requests\StoreCollectionRequest;
use App\Repositories\All\Collections\CollectionInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CollectionController extends Controller
{
    /**
     * @var CollectionInterface
     */
    protected $collectionInterface;

    /**
     * CollectionController constructor.
     *
     * @param CollectionInterface $collectionInterface
     */
    public function __construct(CollectionInterface $collectionInterface) 
    {
        $this->collectionInterface = $collectionInterface;
    }

    public function index()
    {
        $user = Auth::user();

        if ($user && $user->role === 'admin') {
            // Admins see all collections
            $collections = $this->collectionInterface->all(['*'], ['business', 'parent']);
        } elseif ($user && $user->role === 'user') {
            // Users see only collections related to their businesses
            $businessIds = $user->businesses->pluck('id')->toArray();
            $collections = $this->collectionInterface->getByBusinessIds($businessIds, ['*'], ['business', 'parent']);
        } else {
            // Unauthenticated users or other roles see no collections
            $collections = collect();
        }

        return Inertia::render('Collection/collection', [
            'collections' => $collections
        ]);
    }
    
    /**
     * Show the form for creating a new resource.
     */
    public function create()
        {
            $user = Auth::user();

            // Initialize businesses as an empty collection
            $businesses = collect();

            if ($user) {
                if ($user->role === 'admin') {
                    // Fetch all businesses for admin
                    $businesses = Business::all();
                } elseif ($user->role === 'user') {
                    // Fetch only the user's businesses
                    $businesses = $user->businesses;
                }
            }

            // Get all collections for parent selection
            $collections = $this->collectionInterface->all();

            return Inertia::render('Collection/create', [
                'businesses' => $businesses,
                'collections' => $collections
            ]);
        }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCollectionRequest $request)
    {
        $validatedData = $request->validated();
        
        // Log the original request data
        Log::info('Original collection data:', $validatedData);

        // Check if parent_id is a predefined collection (string ID)
        if (isset($validatedData['parent_id']) && !is_numeric($validatedData['parent_id'])) {
            try {
                // Create a new collection based on the predefined parent
                $parentData = [
                    'business_id' => $validatedData['business_id'],
                    'name' => ucfirst($validatedData['parent_id']), // Convert 'shoes' to 'Shoes'
                    'description' => 'Auto-created parent category',
                    'active' => true
                ];
                
                // Create the parent collection
                $parentCollection = $this->collectionInterface->create($parentData);
                
                // Use the new collection's ID as parent_id
                $validatedData['parent_id'] = $parentCollection->id;
                
                // Log the creation of a new parent
                Log::info("Created parent collection '{$parentData['name']}' with ID: {$parentCollection->id}");
                Log::info("Updated child collection parent_id to: {$validatedData['parent_id']}");
            } catch (\Exception $e) {
                // If there's an error creating the parent, set parent_id to null
                Log::error("Failed to create parent collection: " . $e->getMessage());
                $validatedData['parent_id'] = null;
            }
        } else {
            // Safe way to fetch 'parent_id' from validated data if it's numeric or null
            $validatedData['parent_id'] = $validatedData['parent_id'] ?? null;
        }

        // Make sure the parent_id is an integer if it has a value
        if (!empty($validatedData['parent_id'])) {
            $validatedData['parent_id'] = (int)$validatedData['parent_id'];
        }
        
        // Log what we're about to create
        Log::info('Creating collection with data:', $validatedData);
        
        // Create the collection with the updated validatedData
        $collection = $this->collectionInterface->create($validatedData);
        
        return redirect()->route('dashboard.collection')
                        ->with('success', 'Collection created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $collection = $this->collectionInterface->findById((int)$id, ['*'], ['business']);
            
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
    public function edit(string $id)
    {
        try {
            // Get the collection with related business
            $collection = $this->collectionInterface->findById((int)$id, ['*'], ['business']);
            
            // Get all businesses for the dropdown
            $businesses = Business::all();

            // Get all collections for parent selection, excluding the current one
            $collections = $this->collectionInterface->all()->filter(function($item) use ($id) {
                return $item->id != $id;
            })->values();
            
            // Log for debugging
            Log::info("Loading edit form for collection ID: {$id}");
            
            return Inertia::render('Collection/edit', [
                'collection' => $collection,
                'businesses' => $businesses,
                'collections' => $collections
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
            $validated = $request->validate([
                'business_id' => 'required|exists:businesses,id',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'active' => 'boolean',
                'parent_id' => 'nullable|exists:collections,id' // Add validation for parent_id
            ]);

            // Handle parent_id specifically to avoid self-reference
            if (isset($validated['parent_id']) && $validated['parent_id'] == $id) {
                $validated['parent_id'] = null; // Prevent collection from being its own parent
            }
                
            $this->collectionInterface->update((int)$id, $validated);
            
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
            $collection = $this->collectionInterface->findById((int)$id);
            $collectionName = $collection->name;
            
            // Delete the collection
            $this->collectionInterface->deleteById((int)$id);
            
            return redirect()->route('dashboard.collection')
                            ->with('success', "Collection '$collectionName' was deleted successfully.");
                            
        } catch (\Exception $e) {
            Log::error('Collection deletion error: ' . $e->getMessage());
            
            return redirect()->route('dashboard.collection')
                            ->with('error', 'Failed to delete the collection: ' . $e->getMessage());
        }
    }
}