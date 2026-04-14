<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemoOrder extends Model
{
    protected $fillable = [
        'status',
        'assigned_rider'
    ];
}
