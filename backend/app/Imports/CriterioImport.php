<?php

namespace App\Imports;

use App\Models\Criterio;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CriterioImport implements ToModel , WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if (!empty($row['criterio'])&& !empty($row['descripcion']) && !empty($row['vigencia'])) {
            return new Criterio([
                'criterio' => $row['criterio'],
                'descripcion' => $row['descripcion'],
                'vigencia' => $row['vigencia'],
            ]);
        }

        // Si faltan datos en la fila, puedes devolver null para omitir la inserción de este registro.
        return null;
    }
}
