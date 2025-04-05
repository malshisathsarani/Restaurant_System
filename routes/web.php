<?php

use App\Http\Controllers\BusinessController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\ProfileController;
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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard/business', [BusinessController::class, 'index'])->name('dashboard.business');
    Route::get('dashboard/business/create', [BusinessController::class, 'create'])->name('dashboard.business.create');
    Route::post('dashboard/business/store', [BusinessController::class, 'store'])->name('dashboard.business.store');
    Route::get('dashboard/business/{id}/show', [BusinessController::class, 'show'])->name('dashboard.business.show');
    Route::get('dashboard/business/{id}/edit', [BusinessController::class, 'edit'])->name('dashboard.business.edit');
    Route::put('dashboard/business/{id}', [BusinessController::class, 'update'])->name('dashboard.business.update');
    Route::delete('dashboard/business/{id}', [BusinessController::class, 'destroy'])->name('dashboard.business.destroy');
    
});

Route::middleware(['auth', 'verified'])->group(function (){
    Route::get('dashboard/collection', [CollectionController::class, 'index'])->name('dashboard.collection');
Route::get('dashboard/collection/create', [CollectionController::class, 'create'])->name('dashboard.collection.create');
Route::post('dashboard/collection/store', [CollectionController::class, 'store'])->name('dashboard.collection.store');
Route::get('dashboard/collection/{id}/show', [CollectionController::class, 'show'])->name('dashboard.collection.show');
Route::get('dashboard/collection/{id}/edit', [CollectionController::class, 'edit'])->name('dashboard.collection.edit');
Route::put('dashboard/collection/{id}', [CollectionController::class, 'update'])->name('dashboard.collection.update');
Route::delete('dashboard/collection/{id}', [CollectionController::class, 'destroy'])->name('dashboard.collection.destroy');
});

Route::get('dashboard/collection', function () {
    return Inertia::render('Collection/collection'); // Adjust the Inertia page if needed
})->middleware(['auth', 'verified'])->name('dashboard.collection');

Route::get('dashboard/item', function () {
    return Inertia::render('Item/item'); // Adjust the Inertia page if needed
})->middleware(['auth', 'verified'])->name('dashboard.item');

require __DIR__.'/auth.php';