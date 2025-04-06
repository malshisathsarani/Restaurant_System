<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Business extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'logo', 'address'];

    public function collections()
    {
        return $this->hasMany(Collection::class);
    }
}
