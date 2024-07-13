<?php

namespace App\Imports;

use App\Models\habilidad;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class HabilidadImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if (!empty($row['habilidad'])) {
            return new habilidad([
                'habilidad' => $row['habilidad'],
            ]);
        }

        // Si faltan datos en la fila, puedes devolver null para omitir la inserción de este registro.
        return null;
    }
}
