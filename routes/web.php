<?php

use App\Http\Controllers\BusinessController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Business routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard/business', [BusinessController::class, 'index'])->name('dashboard.business');
    Route::get('dashboard/business/create', [BusinessController::class, 'create'])->name('dashboard.business.create');
    Route::post('dashboard/business/store', [BusinessController::class, 'store'])->name('dashboard.business.store');
    Route::get('dashboard/business/{id}/show', [BusinessController::class, 'show'])->name('dashboard.business.show');
    Route::get('dashboard/business/{id}/edit', [BusinessController::class, 'edit'])->name('dashboard.business.edit');
    Route::put('dashboard/business/{id}', [BusinessController::class, 'update'])->name('dashboard.business.update');
    Route::delete('dashboard/business/{id}', [BusinessController::class, 'destroy'])->name('dashboard.business.destroy');
});

// Collection routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard/collection', [CollectionController::class, 'index'])->name('dashboard.collection');
    Route::get('dashboard/collection/create', [CollectionController::class, 'create'])->name('dashboard.collection.create');
    Route::post('dashboard/collection/store', [CollectionController::class, 'store'])->name('dashboard.collection.store');
    Route::get('dashboard/collection/{id}', [CollectionController::class, 'show'])->name('dashboard.collection.show');
    Route::get('dashboard/collection/{id}/edit', [CollectionController::class, 'edit'])->name('dashboard.collection.edit');
    Route::put('dashboard/collection/{id}', [CollectionController::class, 'update'])->name('dashboard.collection.update');
    Route::delete('dashboard/collection/{id}', [CollectionController::class, 'destroy'])->name('dashboard.collection.destroy');
});

// Item routes (single definition)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard/item', [ItemController::class, 'index'])->name('dashboard.item');
    Route::get('dashboard/item/create', [ItemController::class, 'create'])->name('dashboard.item.create');
    Route::post('dashboard/item/store', [ItemController::class, 'store'])->name('dashboard.item.store');
    Route::get('dashboard/item/{id}', [ItemController::class, 'show'])->name('dashboard.item.show');
    Route::get('dashboard/item/{id}/edit', [ItemController::class, 'edit'])->name('dashboard.item.edit');
    Route::put('dashboard/item/{id}', [ItemController::class, 'update'])->name('dashboard.item.update');
    Route::delete('dashboard/item/{id}', [ItemController::class, 'destroy'])->name('dashboard.item.destroy');
    // API route for dependent dropdown
    Route::get('api/collections/{businessId}', [ItemController::class, 'getCollections'])
        ->name('api.collections');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/users', [UserController::class, 'index'])->name('dashboard.users');
});

require __DIR__.'/auth.php';