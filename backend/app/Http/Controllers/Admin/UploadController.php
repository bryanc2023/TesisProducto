<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\AreaImport;
use App\Imports\SectorImport;
use App\Imports\TituloImport;
use App\Imports\UbicacionImport;
use Illuminate\Http\Request;
use App\Models\Ubicacion;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
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
}
