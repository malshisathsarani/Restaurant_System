<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Item extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'business_id',
        'collection_id',
        'title',
        'introduction',
        'description',
        'image_path',
        'active'
    ];
    
    public function business()
    {
        return $this->belongsTo(Business::class);
    }
    
    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }
}