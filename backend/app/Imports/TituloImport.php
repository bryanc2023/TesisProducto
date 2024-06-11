<?php

namespace App\Imports;

use App\Models\Titulo;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class TituloImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if (!empty($row['nivel_educacion']) && !empty($row['campo_amplio'])&& !empty($row['titulo'])) {
            return new Titulo([
                'nivel_educacion' => $row['nivel_educacion'],
                'campo_amplio' => $row['campo_amplio'],
                'titulo' => $row['titulo'],
            ]);
        }

        // Si faltan datos en la fila, puedes devolver null para omitir la inserción de este registro.
        return null;
    }
    
}
