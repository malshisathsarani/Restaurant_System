<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            'App\Repositories\All\Businesses\BusinessInterface',
            'App\Repositories\All\Businesses\BusinessRepository'
        );
        $this->app->bind(
            'App\Repositories\All\Collections\CollectionInterface',
            'App\Repositories\All\Collections\CollectionRepository'
        );

        $this->app->bind(
            'App\Repositories\All\Items\ItemInterface',
            'App\Repositories\All\Items\ItemRepository'

        );

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
