<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Business;
use App\Models\Collection;
use App\Http\Requests\StoreItemRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Item::with(['business', 'collection'])->get();
        
        return Inertia::render('Item/item', [
            'items' => $items
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $businesses = Business::all();
        $collections = Collection::all();
        
        return Inertia::render('Item/create', [
            'businesses' => $businesses,
            'collections' => $collections,
            'csrf' => csrf_token() // Add this line
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
        $validated = $request->validated();

        $this->storeImageIfExists($request, $validated);

        // dd($request->all(), $request->file('image'), $validated);

        Item::create($validated);

        return redirect()->route('dashboard.item')->with('success', 'Item created successfully!');
    }
     
        /**
         * Display the specified resource.
         */
        public function show(string $id)
        {
            try {
                $item = Item::with(['business', 'collection'])->findOrFail($id);
                
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
                $item = Item::findOrFail($id);
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
                $item = Item::findOrFail($id);
                
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
                
                $item->update($validated);
                
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
                $item = Item::findOrFail($id);
                $itemTitle = $item->title;
                
                // Delete image if exists
                if ($item->image_path && Storage::disk('public')->exists($item->image_path)) {
                    Storage::disk('public')->delete($item->image_path);
                }
                
                // Delete the item
                $item->delete();
                
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