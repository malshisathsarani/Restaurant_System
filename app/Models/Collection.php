<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    use HasFactory;
    
    protected $table = 'collections'; // Make sure this matches your actual table name
    
    protected $fillable = [
        
        'business_id',
        'name',
        'description',
        'active'
    ];
    
    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}