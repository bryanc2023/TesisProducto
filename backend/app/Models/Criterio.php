<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Criterio extends Model
{
    use HasFactory;

    protected $table = 'criterio';
    protected $primaryKey = 'id_criterio';

    protected $fillable = [
        'criterio',
        'descripcion',
        'vigencia'
    ];
}
