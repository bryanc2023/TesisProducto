<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\AreaImport;
use App\Imports\CompetenciaImport;
use App\Imports\CriterioImport;
use App\Imports\HabilidadImport;
use App\Imports\IdiomaImport;
use App\Imports\SectorImport;
use App\Imports\TituloImport;
use App\Imports\UbicacionImport;
use App\Models\Competencia;
use App\Models\habilidad;
use Illuminate\Http\Request;
use App\Models\Ubicacion;
use App\Models\Titulo;
use App\Models\AreaTrabajo;
use App\Models\SectorEconomico;
use App\Models\Criterio;
use App\Models\Idioma;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use Exception;

class UploadController extends Controller
{
    public function uploadUbicacion(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx,xls',
            ]);

            $file = $request->file('file');

            Excel::import(new UbicacionImport, $file);

            return response()->json(['message' => 'File uploaded successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function uploadTitulo(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx,xls',
            ]);

            $file = $request->file('file');

            Excel::import(new TituloImport, $file);

            return response()->json(['message' => 'File uploaded successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function uploadSector(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx,xls',
            ]);

            $file = $request->file('file');

            Excel::import(new SectorImport, $file);

            return response()->json(['message' => 'File uploaded successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function uploadArea(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx,xls',
            ]);

            $file = $request->file('file');

            Excel::import(new AreaImport, $file);

            return response()->json(['message' => 'File uploaded successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function uploadCriterio(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx,xls',
            ]);

            $file = $request->file('file');

            Excel::import(new CriterioImport, $file);

            return response()->json(['message' => 'File uploaded successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function uploadIdioma(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx,xls',
            ]);

            $file = $request->file('file');

            Excel::import(new IdiomaImport, $file);

            return response()->json(['message' => 'File uploaded successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }


    public function uploadHabilidad(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx,xls',
            ]);

            $file = $request->file('file');

            Excel::import(new HabilidadImport, $file);

            return response()->json(['message' => 'File uploaded successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function uploadCompetencias(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx,xls',
            ]);

            $file = $request->file('file');

            Excel::import(new CompetenciaImport, $file);

            return response()->json(['message' => 'File uploaded successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function getUbicaciones()
    {
        $ubicaciones = Ubicacion::all();
        return response()->json($ubicaciones);
    }

    public function getTitulos()
    {
        $titulos = Titulo::all();
        return response()->json($titulos);
    }

    public function getSectores()
    {
        $sectores = SectorEconomico::all();
        return response()->json($sectores);
    }

    public function getAreas()
    {
        $areas = AreaTrabajo::all();
        return response()->json($areas);
    }

    public function getCriterios()
    {
        $criterios = Criterio::all();
        return response()->json($criterios);
    }

    public function getIdiomas()
    {
        $idiomas = Idioma::all();
        return response()->json($idiomas);
    }


    public function getHabilidades()
    {
        $habilidades = habilidad::all();
        return response()->json($habilidades);
    }


    public function getCompetencias()
    {
        $competencias = Competencia::all();
        return response()->json($competencias);
    }
    // Métodos de actualización
    public function updateUbicaciones(Request $request)
    {
        try {
            $data = $request->input('data');
            foreach ($data as $item) {
                $item['updated_at'] = now();
                Ubicacion::updateOrCreate(['id' => $item['id']], $item);
            }
            return response()->json(['message' => 'Ubicaciones actualizadas correctamente'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function updateTitulos(Request $request)
    {
        try {
            $data = $request->input('data');
            foreach ($data as $item) {
                $item['updated_at'] = now();
                Titulo::updateOrCreate(['id' => $item['id']], $item);
            }
            return response()->json(['message' => 'Títulos actualizados correctamente'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function updateSectores(Request $request)
    {
        try {
            $data = $request->input('data');
            foreach ($data as $item) {
                $item['updated_at'] = now();
                SectorEconomico::updateOrCreate(['id' => $item['id']], $item);
            }
            return response()->json(['message' => 'Sectores actualizados correctamente'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function updateAreas(Request $request)
    {
        try {
            $data = $request->input('data');
            foreach ($data as $item) {
                $item['updated_at'] = now();
                AreaTrabajo::updateOrCreate(['id' => $item['id']], $item);
            }
            return response()->json(['message' => 'Áreas actualizadas correctamente'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function updateCriterios(Request $request)
    {
        try {
            $data = $request->input('data');
            foreach ($data as $item) {
                $item['updated_at'] = now();
                Criterio::updateOrCreate(['id_criterio' => $item['id_criterio']], $item);
            }
            return response()->json(['message' => 'Criterios actualizados correctamente'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function updateIdiomas(Request $request)
    {
        try {
            $data = $request->input('data');
            foreach ($data as $item) {
                $item['updated_at'] = now();
                Idioma::updateOrCreate(['id' => $item['id']], $item);
            }
            return response()->json(['message' => 'Idiomas actualizados correctamente'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }


    public function updateHabilidad(Request $request)
    {
        try {
            $data = $request->input('data');
            foreach ($data as $item) {
                $item['updated_at'] = now();
                habilidad::updateOrCreate(['id' => $item['id']], $item);
            }
            return response()->json(['message' => 'Idiomas actualizados correctamente'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    
    public function updateCompetencia(Request $request)
    {
        try {
            $data = $request->input('data');
            foreach ($data as $item) {
                $item['updated_at'] = now();
                Competencia::updateOrCreate(['id' => $item['id']], $item);
            }
            return response()->json(['message' => 'Competencias actualizados correctamente'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
