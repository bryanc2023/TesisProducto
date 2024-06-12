<?php

namespace App\Imports;

use App\Models\AreaTrabajo;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AreaImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if (!empty($row['nombre_area']) && !empty($row['vigencia'])) {
            return new AreaTrabajo([
                'nombre_area' => $row['nombre_area'],
                'vigencia' => $row['vigencia'],
            ]);
        }

        // Si faltan datos en la fila, puedes devolver null para omitir la inserción de este registro.
        return null;
    }
}
