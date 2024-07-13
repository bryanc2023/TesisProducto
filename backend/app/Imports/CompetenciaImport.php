<?php

namespace App\Imports;

use App\Models\Competencia;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class CompetenciaImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if (!empty($row['grupo']) && !empty($row['nombre']) && !empty($row['descripcion'])) {
            return new Competencia([
                'grupo' => $row['grupo'],
                'nombre' => $row['nombre'],
                'descripcion' => $row['descripcion'],
            ]);
        }

        // Si faltan datos en la fila, puedes devolver null para omitir la inserción de este registro.
        return null;
    }
}
