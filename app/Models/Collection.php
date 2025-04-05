<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Collection extends Model
{
    use HasFactory;

    protected $fillable = ['business_id', 'name', 'description', 'active'];

    /**
     * Get the business that owns the collection.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}