<?php
use App\Http\Controllers\HabilidadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\CompetenciaController;
use App\Http\Controllers\ConfiguracionController;
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
use App\Http\Controllers\NotificacionesController;
use App\Http\Controllers\Auth\ResetPasswordController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/test-cors', function (Request $request) {
  return response()->json(['message' => 'CORS is working!']);
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

Route::post('ResetPassword3', [UserController::class, 'resetPassword']);
Route::post('reset-password', [ResetPasswordController::class, 'resetPassword']);
Route::middleware(['jwt.verify'])->get('users',[UserController::class,'index']);


Route::middleware(['jwt.verify'])->group(function () {
//Rutas para usuario
Route::get('userById/{id}', [UserController::class, 'getUserById']);

//Rutas para certificados
Route::post('certificadoC',[CursoController::class,'newCertificado']);
Route::get('certificadoId/{id}', [CursoController::class, 'getCertificado']);
Route::get('certificados/{id}', [CursoController::class, 'getCertificados']);
Route::put('certificadoU/{id}', [CursoController::class, 'updateCertificado']);
Route::delete('certificadoD/{id}', [CursoController::class, 'deleteCertificado']);

//Rutas para archivos de tablas satelite
Route::post('uploadUbi',[UploadController::class,'uploadUbicacion']);
Route::post('uploadTit',[UploadController::class,'uploadTitulo']);
Route::post('uploadSec',[UploadController::class,'uploadSector']);
Route::post('uploadA',[UploadController::class,'uploadArea']);
Route::post('uploadC',[UploadController::class,'uploadCriterio']);
Route::post('uploadI',[UploadController::class,'uploadIdioma']);
Route::post('uploadH',[UploadController::class,'uploadHabilidad']);
Route::post('uploadCom',[UploadController::class,'uploadCompetencias']);
Route::get('/ubicacionesR', [UploadController::class, 'getUbicaciones']);
Route::get('/titulosR', [UploadController::class, 'getTitulos']);
Route::get('/sectoresR', [UploadController::class, 'getSectores']);
Route::get('/areasR', [UploadController::class, 'getAreas']);
Route::get('/criteriosR', [UploadController::class, 'getCriterios']);
Route::get('/idiomasR', [UploadController::class, 'getIdiomas']);
Route::post('/updateUbicaciones', [UploadController::class, 'updateUbicaciones']);
Route::post('/updateTitulos', [UploadController::class, 'updateTitulos']);
Route::post('/updateSectores', [UploadController::class, 'updateSectores']);
Route::post('/updateAreas', [UploadController::class, 'updateAreas']);
Route::post('/updateCriterios', [UploadController::class, 'updateCriterios']);
Route::post('/updateIdiomas', [UploadController::class, 'updateIdiomas']);


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
Route::get('/getEmpresaById/{id}', [EmpresaController::class, 'getEmpresaById']);
Route::get('/getEmpresaByName', [EmpresaController::class, 'getEmpresaByName']);

//Rutas para Idioma
Route::get('/idioma', [IdiomaController::class, 'getIdiomasAll']);
Route::get('/idiomas', [IdiomaController::class, 'getIdiomas']);
Route::post('nuevoidioma', [PostulanteController::class, 'registroIdioma']);
Route::put('postulante_idioma/update', [IdiomaController::class, 'updateidiomas']);
Route::delete('postulante_idioma/delete', [IdiomaController::class, 'deleteidiomaPostulante']);


//Rutas para habilidad
Route::get('/habilidadR', [HabilidadController::class, 'getHabilidadesAll']);
Route::get('/habilidades', [HabilidadController::class, 'getHabilidades']);
Route::post('nuevohabilidad', [PostulanteController::class, 'registroHabilidad']);
Route::put('postulante_habilidad/update', [HabilidadController::class, 'updatehabilidades']);
Route::delete('postulante_habilidad/delete', [HabilidadController::class, 'deletehabilidadPostulante']);

//Rutas para competencia
Route::get('/competenciaR', [CompetenciaController::class, 'getCompetenciasAll']);
Route::get('/competencias', [CompetenciaController::class, 'getCompetencias']);
Route::post('nuevocompetencia', [PostulanteController::class, 'registroCompetencia']);
Route::put('postulante_competencia/update', [CompetenciaController::class, 'updatecompetencias']);
Route::delete('postulante_competencia/delete', [CompetenciaController::class, 'deletecompetenciaPostulante']);


//Rutas para Postulante
Route::post('postulanteC',[PostulanteController::class,'registerPos']);
Route::get('postulanteId/id',[PostulanteController::class,'obtenerIdPostulante']);
Route::post('postulante/forma',[PostulanteController::class,'registroFormaAca']);
Route::get('/perfil/{id}', [PostulanteController::class, 'getPerfil']);
Route::get('/curri/{id}', [PostulanteController::class, 'getCurriculum']);
Route::put('/postulantes/{userId}/cv', [PostulanteController::class, 'updateCV']);
Route::get('check-cv/{id_postulante}', [PostulanteController::class, 'checkCv']);
Route::get('/foto/{userId}', [PostulanteController::class, 'getProfileImage']);
Route::post('/exp', [PostulanteController::class, 'agregarExperiencia']);
Route::get('/experiencia/{id}', [PostulanteController::class, 'getExperiencia']);
Route::get('/experienciaById/{id}', [PostulanteController::class, 'getExperienciaById']);
Route::post('postulante/forma2',[PostulanteController::class,'registroFormaAcaPlus']);
Route::get('/areas', [AreaController::class, 'getAreas']);
Route::get('/criterios', [CriterioController::class, 'getCriterios']);
Route::post('add-oferta', [OfertaController::class, 'registerOferta']);
Route::get('oferta/{id}', [OfertaController::class, 'getOfertaById']);
Route::put('update-oferta/{id}', [OfertaController::class, 'updateOferta']);
Route::delete('/oferta/{id}', [OfertaController::class, 'deleteOferta']);
Route::put('/updatePostulanteById/{id}', [PostulanteController::class, 'updatePostulanteByIdUser']);
Route::put('/updateIdioma/{id_postulante}/{id_idioma}', [IdiomaController::class, 'updateIdioma']);
Route::put('/updatePostulanteById/{id}', [PostulanteController::class, 'updatePostulanteByIdUser']);
Route::get('postulante/{id}/cv', [PostulanteController::class, 'getCV']);
Route::post('postulante-red', [PostulanteRedController::class, 'redPostulante']);
Route::get('postulante-red/{id_postulante}', [PostulanteRedController::class, 'getPostulanteReds']);
Route::delete('/experiencia/{id}', [PostulanteController::class, 'deleteExperiencia']);
Route::put('/experiencia/{id}', [PostulanteController::class, 'updateExperiencia']);
Route::get('/postulanteByName', [PostulanteController::class, 'searchPostulante']);
Route::get('/postulanteData/{id}', [PostulanteController::class, 'getPostulanteData']);
Route::get('/postulante/{id_postulante}', [PostulanteController::class, 'getPostulanteById']);



Route::put('/formacion_academica/update', [PostulanteController::class, 'updateFormacionAcademica']);
Route::delete('/formacion_academica/delete', [PostulanteController::class, 'deleteFormacionAcademica']);

//Rutas para la Empresa Gestora
Route::get('usuarios/postulantes', [EmpresaGestoraController::class, 'getPostulantes']);
Route::get('usuarios/empresas', [EmpresaGestoraController::class, 'getEmpresas']);
Route::get('usuarios/ofertas', [EmpresaGestoraController::class, 'getOfertas']);
Route::get('/ofertas-por-mes', [EmpresaGestoraController::class, 'getOfertasPorMes']);
Route::get('/usuarios-registrados-por-mes', [EmpresaGestoraController::class, 'getUsuariosRegistradosPorMes']);
Route::get('/postulaciones-por-mes', [EmpresaGestoraController::class, 'getPostulacionesPorMes']);
Route::get('/areasG', [EmpresaGestoraController::class, 'getAreas']);
Route::get('/ubicacionesG', [EmpresaGestoraController::class, 'getUbicaciones']);
Route::get('/postulantes-por-ubicacion', [EmpresaGestoraController::class, 'getPostulantesPorUbicacion']);
Route::get('/postulantes-por-area', [EmpresaGestoraController::class, 'getPostulantesPorArea']);
Route::get('/postulantes-por-genero', [EmpresaGestoraController::class, 'getPostulantesPorGenero']);



//Rutas de notificaciones
Route::get('/notificaciones', [NotificacionesController::class, 'index']);
Route::post('/notificaciones/{id}', [NotificacionesController::class, 'marcarLeida']);
Route::post('/notificacionesL', [NotificacionesController::class, 'marcarTodasLeidas']);




Route::get('empresa/{idEmpresa}/ofertas', [OfertaController::class, 'getOfertasByEmpresa']);
Route::get('/ofertas', [OfertaController::class, 'getAllOfertas']);
Route::post('/pos', [PostulacionController::class, 'verPostulante']);


Route::post('postular', [PostulacionController::class, 'registroPostulacion']);
Route::get('postulaciones/{id}', [PostulacionController::class, 'getPostulacionPostulante']);
Route::get('postulacionesE/{id}', [PostulacionController::class, 'getPostulacionEmpresa']);
Route::get('estadistica/{id}', [PostulacionController::class, 'getPostulacionEsta']);
Route::post('actualizar-postulaciones', [PostulacionController::class, 'actualizarPostulaciones']);
Route::get('existe-aprobado', [PostulacionController::class, 'existePostulacionAprobadaParaOferta']);


Route::get('perfildet/{id}', [PostulanteController::class, 'getPerfilEmpresa']);


Route::get('/configuraciones', [ConfiguracionController::class, 'index']);
Route::post('/configuraciones', [ConfiguracionController::class, 'store']);
Route::post('/configuraciones/{id}/activate', [ConfiguracionController::class, 'activate']);
Route::get('/configuracion/activa', [ConfiguracionController::class, 'getActiveConfiguration']);

Route::get('/users', [UserController::class, 'index']);
Route::get('/roles', [UserController::class, 'index2']);
Route::get('/first', [UserController::class, 'getFirstLoginDate']);


Route::get('/criteriosAll', [CriterioController::class, 'index']);


});


Route::middleware('auth:api')->group(function () {
  // Aquí van las rutas protegidas por JWT

 
  
});