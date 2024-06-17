<?php

namespace App\Imports;

use App\Models\Idioma;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class IdiomaImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if (!empty($row['nombre'])) {
            return new Idioma([
                'nombre' => $row['nombre'],
            ]);
        }

        // Si faltan datos en la fila, puedes devolver null para omitir la inserción de este registro.
        return null;
    }
}
