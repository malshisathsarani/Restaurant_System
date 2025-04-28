<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Collection;
use App\Http\Requests\StoreItemRequest;
use App\Repositories\All\Items\ItemInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ItemController extends Controller
{
    /**
     * @var ItemInterface
     */
    protected $itemInterface;

    /**
     * ItemController constructor.
     *
     * @param ItemInterface $itemInterface
     */
    public function __construct(ItemInterface $itemInterface)
    {
        $this->itemInterface = $itemInterface;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $user = Auth::user();

    if ($user && $user->role === 'admin') {
        // Admin sees all items
        $items = $this->itemInterface->all(['*'], ['business', 'collection']);
    }
    elseif ($user && $user->role === 'user') {
        // User only sees items belonging to their businesses
        $businessIds = $user->businesses->pluck('id')->toArray();
        $items = $this->itemInterface->getByBusinessIds(
            $businessIds, 
            ['*'], 
            ['business', 'collection']
        );
    }
    else {
        // Unauthenticated / other roles see nothing
        $items = collect();
    }

    return Inertia::render('Item/item', [
        'items' => $items
    ]);
}


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $user = Auth::user();

        $collections = Collection::all();

        if ($user) {
            if ($user->role === 'admin') {
                // Fetch all businesses for admin
                $businesses = Business::all();
            } elseif ($user->role === 'user') {
                // Fetch only the user's businesses
                $businesses = $user->businesses;
            }
        }
        
        return Inertia::render('Item/create', [
            'businesses' => $businesses,
            'collections' => $collections,
            'csrf' => csrf_token()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreItemRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreItemRequest $request)
    {
        try {
            $validated = $request->validated();

            $this->storeImageIfExists($request, $validated);

            // Create item using repository
            $this->itemInterface->create($validated);

            return redirect()->route('dashboard.item')->with('success', 'Item created successfully!');
        } catch (\Exception $e) {
            Log::error('Item creation error: ' . $e->getMessage());
            
            return redirect()->back()
                ->withErrors(['error' => 'Failed to create item: ' . $e->getMessage()])
                ->withInput();
        }
    }
     
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Find item by ID with relationships using repository
            $item = $this->itemInterface->findById((int)$id, ['*'], ['business', 'collection']);
            
            return Inertia::render('Item/show', [
                'item' => $item
            ]);
        } catch (\Exception $e) {
            Log::error("Error finding item {$id}: " . $e->getMessage());
            
            return redirect()->route('dashboard.item')
                        ->with('error', 'Item not found');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            // Find item by ID using repository
            $item = $this->itemInterface->findById((int)$id);
            $businesses = Business::all();
            $collections = Collection::where('business_id', $item->business_id)->get();
            
            return Inertia::render('Item/edit', [
                'item' => $item,
                'businesses' => $businesses,
                'collections' => $collections
            ]);
        } catch (\Exception $e) {
            Log::error("Error loading edit form for item {$id}: " . $e->getMessage());
            
            return redirect()->route('dashboard.item')
                        ->with('error', 'Item not found.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            // Find item by ID using repository
            $item = $this->itemInterface->findById((int)$id);
            
            $validated = $request->validate([
                'business_id' => 'required|exists:businesses,id',
                'collection_id' => 'required|exists:collections,id',
                'title' => 'required|string|max:255',
                'introduction' => 'nullable|string',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'active' => 'boolean'
            ]);
            
            // Handle image upload if present
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($item->image_path && Storage::disk('public')->exists($item->image_path)) {
                    Storage::disk('public')->delete($item->image_path);
                }
                
                $path = $request->file('image')->store('items', 'public');
                $validated['image_path'] = $path;
            }
            
            // Update item using repository
            $this->itemInterface->update((int)$id, $validated);
            
            return redirect()->route('dashboard.item')
                            ->with('success', 'Item updated successfully.');
        } catch (\Exception $e) {
            Log::error('Item update error: ' . $e->getMessage());
            
            return redirect()->back()
                            ->withErrors(['error' => 'Failed to update item: ' . $e->getMessage()])
                            ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            // Find item by ID using repository
            $item = $this->itemInterface->findById((int)$id);
            $itemTitle = $item->title;
            
            // Delete image if exists
            if ($item->image_path && Storage::disk('public')->exists($item->image_path)) {
                Storage::disk('public')->delete($item->image_path);
            }
            
            // Delete the item using repository
            $this->itemInterface->deleteById((int)$id);
            
            return redirect()->route('dashboard.item')
                            ->with('success', "Item '{$itemTitle}' was deleted successfully.");
        } catch (\Exception $e) {
            Log::error('Item deletion error: ' . $e->getMessage());
            
            return redirect()->route('dashboard.item')
                            ->with('error', 'Failed to delete the item: ' . $e->getMessage());
        }
    }
    
    /**
     * Get collections for a specific business (for dynamic dropdown)
     */
    public function getCollections($businessId)
    {
        $collections = Collection::where('business_id', $businessId)
                            ->where('active', true)
                            ->get();
        
        return response()->json($collections);
    }

    /**
     * Store the image if it exists in the request.
     *
     * @param \Illuminate\Http\Request $request
     * @param array $validated
     * @return void
     */
    private function storeImageIfExists(Request $request, array &$validated)
    {
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('items', 'public');
            $validated['image_path'] = $path;
        }
    }
}