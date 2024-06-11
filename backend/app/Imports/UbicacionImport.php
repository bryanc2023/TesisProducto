<?php

namespace App\Imports;

use App\Models\Ubicacion;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UbicacionImport implements ToModel, WithHeadingRow
{
        /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if (!empty($row['provincia']) && !empty($row['canton'])) {
            return new Ubicacion([
                'provincia' => $row['provincia'],
                'canton' => $row['canton'],
            ]);
        }

        // Si faltan datos en la fila, puedes devolver null para omitir la inserción de este registro.
        return null;
    }
}
