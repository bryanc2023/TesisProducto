<?php

namespace App\Http\Controllers;

use App\Models\CriterioOferta;
use App\Models\EducacionRequerida;
use App\Models\Empresa;
use App\Models\Oferta;
use App\Models\Ubicacion;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OfertaController extends Controller
{
    public function registerOferta(Request $request){

          // Validar los datos recibidos
          $validatedData = $request->validate([
            'cargo' => 'required|string|max:255',
            'id_area' => 'required|integer',
            'experiencia' => 'integer',
            'objetivo_cargo' => 'required|string|max:500',
            'sueldo' => 'required|numeric',
            'correo_contacto' => 'nullable|email|max:255',
            'numero_contacto' => 'nullable|string|max:20',
            'detalles_adicionales' => 'nullable|string',
            'mostrar_sueldo' => 'required|boolean',
            'mostrar_empresa' => 'required|boolean',
            'solicitar_sueldo' =>'required|boolean',
            'fecha_max_pos' => 'required|date',
            'funciones' => 'required|string',
            'modalidad' => 'required|string',
            'carga_horaria' =>'required|string',
            'titulos' => 'nullable|array',
            'titulos.*.id' => 'integer',
            'titulos.*.titulo' => 'string|max:255',
            'criterios' => 'nullable|array',
            'criterios.*.id_criterio' => 'integer',
            'criterios.*.criterio' => 'string|max:255',
            'criterios.*.descripcion' => 'string|max:255',
            'criterios.*.valor' => 'string|nullable|max:255',
            'criterios.*.prioridad' => 'integer|between:1,3',
            'usuario' => 'required|integer',
        ]);
        // Buscar el usuario por ID
        $user = Empresa::getIdEmpresaPorIdUsuario($validatedData['usuario']);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

       

        // Crear una nueva oferta
        $oferta = new Oferta();
        $oferta->cargo = $validatedData['cargo'];
        $oferta->id_area = $validatedData['id_area'];
        $oferta->id_empresa = $user;
        $oferta->experiencia = $validatedData['experiencia'];
        $oferta->objetivo_cargo = $validatedData['objetivo_cargo'];
        $oferta->sueldo = $validatedData['sueldo'];
        $oferta->correo_contacto = $validatedData['correo_contacto'];
        $oferta->numero_contacto = $validatedData['numero_contacto'];
        $oferta->detalles_adicionales = $validatedData['detalles_adicionales'];
        $oferta->n_mostrar_sueldo = $validatedData['mostrar_sueldo'];
        $oferta->n_mostrar_empresa = $validatedData['mostrar_empresa'];
        $oferta->soli_sueldo = $validatedData['solicitar_sueldo'];
        $oferta->fecha_publi = Carbon::now();
        $oferta->carga_horaria =$validatedData['carga_horaria'];
        $oferta->modalidad =$validatedData['modalidad'];
        $oferta->estado = "En espera";
        $oferta->fecha_max_pos = $validatedData['fecha_max_pos'];
        $oferta->funciones = $validatedData['funciones'];
        $oferta->save();
      

     

        if (!empty($validatedData['titulos'])) {
            foreach ($validatedData['titulos'] as $titulo) {
                EducacionRequerida::create([
                    'id_oferta' => $oferta->id_oferta,
                    'id_titulo' => $titulo['id'],
                ]);
            }
        }
        if (!empty($validatedData['criterios'])) {
            foreach ($validatedData['criterios'] as $criterio) {
                CriterioOferta::create([
                    'id_criterio' => $criterio['id_criterio'],
                    'valor' => $criterio['valor'],
                    'prioridad' => $criterio['prioridad'],
                    'id_oferta' => $oferta->id_oferta,
                ]);
            }
        }

        
         
        return response()->json(['message' => 'Oferta creado exitosamente', 'oferta' => $oferta], 201);
    }

    public function getOfertasByEmpresa($idEmpresa, Request $request)
    {
        $user = Empresa::getIdEmpresaPorIdUsuario($idEmpresa);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
    
        $query = Oferta::where('id_empresa', $user)
                       ->with(['areas', 'criterios', 'expe']);
    
        // Verifica si se proporcionó la fecha_publi en los parámetros de la solicitud
        if ($request->has('fecha_publi')) {
            $fechaPubli = $request->input('fecha_publi');
            // Agrega la condición para filtrar por fecha de publicación
            $query->whereDate('fecha_publi', $fechaPubli);
        }
    
        $ofertas = $query->get();
    
        return response()->json(['ofertas' => $ofertas]);
    }
    
public function getAllOfertas()
{
    $ofertas = Oferta::with(['areas', 'criterios', 'empresa','expe'])
                     ->get();

    return response()->json(['ofertas' => $ofertas]);
}


}
