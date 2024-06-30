<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\CriterioController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\IdiomaController;
use App\Http\Controllers\OfertaController;
use App\Http\Controllers\PostulacionController;
use App\Http\Controllers\PostulanteController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\TituloController;
use App\Http\Controllers\UbicacionController;
use App\Http\Controllers\PostulanteRedController;
use App\Http\Controllers\EmpresaRedController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\EmpresaGestoraController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('auth')->group(function(){
  Route::post('register',[AuthController::class,'register'])->name('verification.verify');
  Route::post('registerE',[AuthController::class,'registerEmpresa'])->name('verification.verify');
  Route::post('login',[AuthController::class,'login'])->name('login');
  Route::post('loginE',[AuthController::class,'loginEmpresa'])->name('login');
  // Ruta de verificación de correo electrónico sin autenticación
  Route::get('/verifyEmail/{id}/{hash}', [AuthController::class, 'verify'])->name('verification.verify');

  // Ruta para reenviar correo de verificación con autenticación
  Route::middleware('auth:sanctum')->post('email/resend', [AuthController::class, 'resend'])->name('verification.resend');
});

Route::middleware(['jwt.verify'])->get('users',[UserController::class,'index']);

//Rutas para usuario
Route::get('userById/{id}', [UserController::class, 'getUserById']);

//Rutas para certificados
Route::post('certificadoC',[CursoController::class,'newCertificado']);
Route::get('certificadoId/{id}', [CursoController::class, 'getCertificado']);
Route::get('certificados', [CursoController::class, 'getCertificados']);
Route::put('certificadoU/{id}', [CursoController::class, 'updateCertificado']);
Route::delete('certificadoD/{id}', [CursoController::class, 'deleteCertificado']);


Route::post('uploadUbi',[UploadController::class,'uploadUbicacion']);
Route::post('uploadTit',[UploadController::class,'uploadTitulo']);
Route::post('uploadSec',[UploadController::class,'uploadSector']);
Route::post('uploadA',[UploadController::class,'uploadArea']);
Route::post('uploadC',[UploadController::class,'uploadCriterio']);
Route::post('uploadI',[UploadController::class,'uploadIdioma']);

Route::get('/ubicaciones', [UbicacionController::class, 'getProvinciasCantones']);
Route::get('/ubicaciones/cantones/{province}', [UbicacionController::class, 'getCantonesPorProvincia']);
Route::get('/ubicaciones/cantonesid/{province}', [UbicacionController::class, 'getCantonesPorProvinciaID']);
Route::get('/ubicaciones/{provincia}/{canton}', [UbicacionController::class, 'getUbicacionId']);

Route::get('/sectores', [SectorController::class, 'getSectores']);
Route::get('/sectores/{sector}', [SectorController::class, 'getDivisionSector']);

Route::get('/titulos', [TituloController::class, 'getTitulosNivelesCampos']);
Route::get('/titulos/{nivel}', [TituloController::class, 'getCamposNivel']);
Route::get('/titulos/{nivel}/{campo}', [TituloController::class, 'getTitulosCamposNivel']);
Route::get('/titulos/{nivel}/{campo}/{titulo}', [TituloController::class, 'getTituloId']);


//Rutas para Empresa
Route::post('empresaC',[EmpresaController::class,'registerEmp']);
Route::post('completo',[EmpresaController::class,'completo']);
Route::get('empresaById/{id}', [EmpresaController::class, 'getEmpresaByIdUser']);
Route::put('updateEmpresaById/{id}', [EmpresaController::class, 'updateEmpresaByIdUser']);
Route::post('/empresa-red', [EmpresaRedController::class, 'redEmpresa']);
Route::get('/empresa-red/{id_empresa}', [EmpresaRedController::class, 'getRedEmpresa']);

//Rutas para Idioma
Route::get('/idioma', [IdiomaController::class, 'getIdiomasAll']);
Route::get('/idiomas', [IdiomaController::class, 'getIdiomas']);
Route::post('nuevoidioma', [PostulanteController::class, 'registroIdioma']);
Route::put('postulante_idioma/update', [IdiomaController::class, 'updateidiomas']);
Route::delete('postulante_idioma/delete', [IdiomaController::class, 'deleteidiomaPostulante']);

//Rutas para Postulante
Route::post('postulanteC',[PostulanteController::class,'registerPos']);
Route::get('postulanteId/id',[PostulanteController::class,'obtenerIdPostulante']);
Route::post('postulante/forma',[PostulanteController::class,'registroFormaAca']);
Route::get('/perfil/{id}', [PostulanteController::class, 'getPerfil']);
Route::get('/curri/{id}', [PostulanteController::class, 'getCurriculum']);
Route::put('/postulantes/{userId}/cv', [PostulanteController::class, 'updateCV']);
Route::get('/foto/{userId}', [PostulanteController::class, 'getProfileImage']);
Route::post('/exp', [PostulanteController::class, 'agregarExperiencia']);
Route::get('/experiencia/{id}', [PostulanteController::class, 'getExperiencia']);
Route::get('/experienciaById/{id}', [PostulanteController::class, 'getExperienciaById']);
Route::post('postulante/forma2',[PostulanteController::class,'registroFormaAcaPlus']);
Route::get('/areas', [AreaController::class, 'getAreas']);
Route::get('/criterios', [CriterioController::class, 'getCriterios']);
Route::post('add-oferta', [OfertaController::class, 'registerOferta']);
Route::put('/updatePostulanteById/{id}', [PostulanteController::class, 'updatePostulanteByIdUser']);
Route::put('/updateIdioma/{id_postulante}/{id_idioma}', [IdiomaController::class, 'updateIdioma']);
Route::put('/updatePostulanteById/{id}', [PostulanteController::class, 'updatePostulanteByIdUser']);
Route::get('postulante/{id}/cv', [PostulanteController::class, 'getCV']);
Route::post('postulante-red', [PostulanteRedController::class, 'redPostulante']);
Route::get('postulante-red/{id_postulante}', [PostulanteRedController::class, 'getPostulanteReds']);
Route::delete('/experiencia/{id}', [PostulanteController::class, 'deleteExperiencia']);
Route::put('/experiencia/{id}', [PostulanteController::class, 'updateExperiencia']);



Route::put('/formacion_academica/update', [PostulanteController::class, 'updateFormacionAcademica']);
Route::delete('/formacion_academica/delete', [PostulanteController::class, 'deleteFormacionAcademica']);

//Rutas para la Empresa Gestora
Route::get('usuarios/postulantes', [EmpresaGestoraController::class, 'getPostulantes']);
Route::get('usuarios/empresas', [EmpresaGestoraController::class, 'getEmpresas']);


Route::middleware('auth:api')->group(function () {
  // Aquí van las rutas protegidas por JWT

 
  
});

Route::get('empresa/{idEmpresa}/ofertas', [OfertaController::class, 'getOfertasByEmpresa']);
Route::get('/ofertas', [OfertaController::class, 'getAllOfertas']);
Route::post('/pos', [PostulacionController::class, 'verPostulante']);


Route::post('postular', [PostulacionController::class, 'registroPostulacion']);
Route::get('postulaciones/{id}', [PostulacionController::class, 'getPostulacionPostulante']);
Route::get('postulacionesE/{id}', [PostulacionController::class, 'getPostulacionEmpresa']);
Route::get('estadistica/{id}', [PostulacionController::class, 'getPostulacionEsta']);


Route::get('perfildet/{id}', [PostulanteController::class, 'getPerfilEmpresa']);