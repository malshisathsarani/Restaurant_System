<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessRequest;
use App\Repositories\All\Businesses\BusinessInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Business;

class BusinessController extends Controller
{
    /**
     * @var BusinessInterface
     */
    protected $businessInterface;

    /**
     * BusinessController constructor.
     *
     * @param BusinessInterface $businessInterface
     */
    public function __construct(BusinessInterface $businessInterface)
    {
        $this->businessInterface = $businessInterface;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $businesses = $this->businessInterface->all(['*']);
    
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
    try {
        // Form Request automatically validates so we use validated() to get the data.
        $validated = $request->validated();
        
        // More detailed debugging
        Log::info('Starting business creation process');
        Log::info('Validated business data:', $validated);
        
        // Try direct database creation to test
        DB::beginTransaction();
        try {
            // Save the data using the repository
            $business = $this->businessInterface->create($validated);
            
            // Log the result
            if ($business) {
                Log::info('Business created successfully', ['id' => $business->id, 'name' => $business->name]);
            } else {
                Log::warning('Repository create method returned null or false');
            }
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Database transaction failed: ' . $e->getMessage());
            throw $e;
        }

        return redirect()->route('dashboard.business')
            ->with('success', 'Business created successfully.');
    } catch (\Exception $e) {
        Log::error('Business creation error: ' . $e->getMessage());
        Log::error('Stack trace: ' . $e->getTraceAsString());
        
        return redirect()->back()
            ->withErrors(['error' => 'Failed to create business: ' . $e->getMessage()])
            ->withInput();
    }
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $business = $this->businessInterface->findById((int)$id);
            
            // Debug output
            Log::info("Found business: {$business->name} with ID: {$id}");
            
            return Inertia::render('Business/show', [
                'business' => $business
            ]);
        } catch (\Exception $e) {
            Log::error("Error finding business {$id}: " . $e->getMessage());
            
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
            $business = $this->businessInterface->findById((int)$id);
            
            // Log for debugging
            Log::info("Loading edit form for business ID: {$id}");
            
            return Inertia::render('Business/edit', [
                'business' => $business
            ]);
        } catch (\Exception $e) {
            Log::error("Error loading edit form for business {$id}: " . $e->getMessage());
            
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
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'logo' => 'nullable|string|max:2000',
                'address' => 'required|string|max:1000',
            ]);
            
            $this->businessInterface->update((int)$id, $validated);
            
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
            $business = $this->businessInterface->findById((int)$id);
            $businessName = $business->name;
            
            // Delete the business using the repository
            $this->businessInterface->deleteById((int)$id);
            
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