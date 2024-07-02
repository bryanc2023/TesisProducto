import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "../../services/axios";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FaHandPaper , FaSearch} from 'react-icons/fa';
import { FiUser, FiEye } from 'react-icons/fi';

interface Oferta {
    id_oferta: number;
    estado: string;
    cargo: string;
    areas: {
        id: number;
        nombre_area: string;
    };
    empresa: {
        id_empresa: string,
        nombre_comercial: string;
        logo: string;
    };
    fecha_max_pos: string;
    n_mostrar_empresa: number;
    modalidad: string;
    carga_horaria: string;
    experiencia: number;
    funciones: string;
    objetivo_cargo: string;
    detalles_adicionales: string;
    criterios: Criterio[];
    expe: {
        titulo: string;
        nivel_educacion: string;
    }[];
    sueldo: string;
    n_mostrar_sueldo: number;
    soli_sueldo: number;
    // Define otros campos de la oferta según sea necesario
}
interface Idioma {
    id: number;
    nombre: string;
}

interface Criterio {
    criterio: string;
    pivot: {
        valor: string;
    };
}

interface ModalProps {
    oferta: Oferta | null;
    onClose: () => void;
    userId: number | undefined;
}

interface Area {
    id: number;
    nombre_area: string;
}

interface PostData {
    id_postulante: number | undefined;
    id_oferta: number;
    sueldo?: number | null; // Hacer sueldo opcional en la interfaz
}

interface CheckCvResponse {
    hasCv: boolean;
    message: string;
}
function Modal({ oferta, onClose, userId }: ModalProps) {



    const [sueldoDeseado, setSueldoDeseado] = useState(null);
    const [checkCvResponse, setCheckCvResponse] = useState<CheckCvResponse | null>(null);

    const fetchCvStatus = async () => {
        try {
            const response = await axios.get(`check-cv/${userId}`);
            setCheckCvResponse(response.data);
        } catch (error) {
            console.error('Error checking CV status:', error);
        }
    };

    useEffect(() => {
        fetchCvStatus();
    }, []);


    const navigate = useNavigate();

    // Función para formatear fecha
    const formatFechaMaxPos = (fecha: string) => {
        const date = new Date(fecha);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };
    if (!oferta) return null;
    const handlePostular = async () => {
        console.log(`id_usuario: ${userId}, id_oferta: ${oferta.id_oferta}, sueldo: ${sueldoDeseado}`);
        // Validar si el sueldo deseado es requerido y está vacío
        if (oferta.soli_sueldo === 1 && (sueldoDeseado === null || sueldoDeseado === undefined)) {
            Swal.fire({
                title: '¡Error!',
                text: 'El campo de sueldo es obligatorio.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }
        try {

            await fetchCvStatus();

            if (!checkCvResponse?.hasCv) {
                Swal.fire({
                    title: '¡Error!',
                    text: "Parece que no has generado tu cv. Ve a la pestaña CV y generalo antes de postular",
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return;
            }

            const postData: PostData = {
                id_postulante: userId,
                id_oferta: oferta.id_oferta,
            };

            // Agregar sueldoDeseado al postData solo si está definido y no es null
            if (sueldoDeseado !== null && sueldoDeseado !== undefined) {
                postData.sueldo = sueldoDeseado;
                // Verificar si el sueldo es requerido y no está definido
            }

            await axios.post('postular', postData);
            Swal.fire({
                title: '¡Hecho!',
                text: 'Te has postulado a la oferta seleccionado, verifica el estado de tu postulación en los resultados',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                navigate("/verOfertasAll");
            });
        } catch (error: any) {
            console.error('Error postulando:', error);
            // Comprobar si el error es debido a la falta de CV
            if (error.response && error.response.status === 400 && error.response.data.message === 'No has subido tu CV.') {
                Swal.fire({
                    title: '¡Error!',
                    text: 'No has generado tu CV. Ve a la pestaña de CV de perfil y generalo',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            } else {
                Swal.fire({
                    title: '¡Ha ocurrido un error!',
                    text: 'Ya has postulado para esta oferta, consulta su estado en la pestaña de "Consultar postulación".',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    navigate("/verOfertasAll");
                });
            }
        }
    };

    const renderFunciones = () => {
        if (!oferta.funciones) return null;

        // Verificar si hay comas en funciones
        if (oferta.funciones.includes(',')) {
            // Dividir las funciones por comas y renderizar como lista con viñetas
            const funcionesList = oferta.funciones.split(',').map((funcion, index) => (
                <li key={index}>+ {funcion.trim()} </li>
            ));
            return <ul> {funcionesList}</ul>;
        } else {
            // Renderizar directamente como texto
            return <p>{oferta.funciones}</p>;
        }
    };
    const renderDetalles = () => {
        if (!oferta.detalles_adicionales) return null;

        // Verificar si hay comas en funciones
        if (oferta.detalles_adicionales.includes(',')) {
            // Dividir las funciones por comas y renderizar como lista con viñetas
            const detallesList = oferta.detalles_adicionales.split(',').map((detalle, index) => (
                <li key={index}>+ {detalle.trim()} </li>
            ));
            return <ul> {detallesList}</ul>;
        } else {
            // Renderizar directamente como texto
            return <p>{oferta.detalles_adicionales}</p>;
        }
    };


    const renderCriterioValor = (criterio: Criterio) => {
        if (criterio && criterio.pivot && criterio.pivot.valor) {
            const valorArray = criterio.pivot.valor.split(",");

            switch (criterio.criterio) {
                case 'Experiencia':
                    return "Los años mínimos indicados";
                case 'Titulo':
                    return "Alguno de los títulos mencionados";
                case 'Sueldo':
                    return "Indicar el sueldo prospecto a ganar";
                case 'Edad':
                    return valorArray.length > 1 ? valorArray[2].trim() : criterio.pivot.valor;
                case 'Ubicación':
                    return valorArray.length > 1 ? valorArray[1].trim() : criterio.pivot.valor;
                case 'Idioma':
                    return valorArray.length > 1 ? valorArray[1].trim() : criterio.pivot.valor;
                case 'Estado Civil':
                    switch (criterio.pivot.valor) {
                        case "Casado":
                            return "Casado/a";
                        case "Soltero":
                            return "Soltero/a";
                        default:
                            return "Viudo/a";
                    }
                default:
                    return criterio.pivot.valor;
            }
        } else {
            return "";
        }
    };




    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">

            <div className="bg-white p-4 rounded shadow-lg w-11/12 md:w-1/2 text-center overflow-auto max-h-screen md:max-h-96"
                style={{ maxHeight: `calc(100vh - 30px)` }}>

                <button onClick={onClose} className="text-white bg-red-500 rounded-full w-8 h-8 absolute top-4 right-4 z-50 flex items-center justify-center">X</button>
                <h2 className="text-xl font-bold mb-4">{oferta.cargo}</h2>
                <div className="flex justify-center items-center mb-4">
                    <img
                        src={oferta.n_mostrar_empresa === 1 ? '/images/anonima.png' : oferta.empresa.logo}
                        alt="Logo"
                        className="w-44 h-24  shadow-lg mr-4"
                    />
                </div>
                <div className="text-center">
                    <div>
                        {oferta.expe.length > 0 && (
                            <>
                                <p className="text-gray-700 mb-1"><strong>Título/s solicitados:</strong></p>
                                <ul>
                                    {oferta.expe.map((titulo, index) => (
                                        <li key={index}>
                                            <p>• {titulo.titulo}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                    <p className="text-gray-700 mb-1"><strong>Empresa:</strong> {oferta.n_mostrar_empresa === 1 ? 'Anónima' : oferta.empresa.nombre_comercial}</p>
                    <p className="text-gray-700 mb-1"><strong>Sueldo:</strong>{oferta.n_mostrar_sueldo === 1 ? 'No descrito' : `${oferta.sueldo}$`}</p>
                    <p className="text-gray-700 mb-1"><strong>Experiencia en cargos similares:</strong> {oferta.experiencia === 0 ? 'No requerida' : `${oferta.experiencia} año/s`}</p>
                    <p className="text-gray-700 mb-1"><strong>Carga Horaria:</strong> {oferta.carga_horaria}</p>
                    <p className="text-gray-700 mb-1"><strong>Fecha Máxima De Postulación:</strong> {formatFechaMaxPos(oferta.fecha_max_pos)}</p>

                </div>
                <div className="text-left">
                    <p className="text-gray-700 mb-1"><strong>Objetivo del cargo:</strong> {oferta.objetivo_cargo}</p>
                    <div>
                        <p className="text-gray-700 mb-1"><strong>Funciones:</strong></p>
                        {renderFunciones()}
                    </div>
                    <div>
                        <p className="text-gray-700 mb-1"><strong>Detalles adicionales:</strong></p>
                        {renderDetalles()}
                    </div>
                    <div>

                        {oferta.criterios.length > 0 ? (
                            <>
                                <p className="text-gray-700 mb-1"><strong>Requisitos adicionales:</strong></p>
                                <p>La empresa especificó que se requiere los siguientes criterios adicionales:</p>
                                <ul>
                                    {oferta.criterios.map((criterio, index) => (
                                        <li key={index}>
                                            <p><strong>⁃ {criterio.criterio}:</strong> {renderCriterioValor(criterio)}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className="text-gray-700 mb-1" ></p>
                        )}

                    </div>
                    {oferta.soli_sueldo === 1 && (
                        <div className="mt-4">
                            <label htmlFor="sueldoDeseado" className="text-gray-700 block mb-2"><strong>Ingrese el sueldo deseado a ganar en el trabajo:</strong></label>
                            <input
                                type="number"
                                id="sueldoDeseado"
                                className="w-1/2 p-2 border rounded mr-2"
                                value={sueldoDeseado}
                                onChange={(e) => setSueldoDeseado(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <button onClick={handlePostular} className="mt-4 bg-blue-500 text-white p-2 rounded">Postular</button>
            </div>
        </div>
    );
}
function VerOfertasAll() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [areas, setAreas] = useState<Area[]>([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [fechaMaxPosFilter, setFechaMaxPosFilter] = useState('');
    const ofertasPerPage = 5;

    // Función para formatear fecha
    const formatFechaMaxPos = (fecha: string) => {
        const date = new Date(fecha);
        // Ajustar la fecha para evitar el problema de zona horaria
        date.setDate(date.getDate() + 1);

        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };
    useEffect(() => {
        fetchOfertas();
        fetchAreas();

    }, []);

    const fetchAreas = async () => {
        try {
            const response = await axios.get(`areas`); // Reemplaza con tu URL para obtener las áreas
            setAreas(response.data.areas);
        } catch (error) {
            console.error('Error fetching areas:', error);
        }
    };

    const fetchOfertas = async () => {
        try {
            const response = await axios.get(`ofertas`); // Reemplaza con tu URL y ID de empresa
            setOfertas(response.data.ofertas);
        } catch (error) {
            console.error('Error fetching ofertas:', error);
        }
    };


    const filteredOfertas = ofertas.filter((oferta) =>
        (searchTerm === '' || oferta.cargo.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedArea === '' || oferta.areas.nombre_area === selectedArea) &&
        (fechaMaxPosFilter === '' || oferta.fecha_max_pos === fechaMaxPosFilter)
    );

    // Lógica para obtener las ofertas de la página actual
    const indexOfLastOferta = currentPage * ofertasPerPage;
    const indexOfFirstOferta = indexOfLastOferta - ofertasPerPage;
    const currentOfertas = filteredOfertas.slice(indexOfFirstOferta, indexOfLastOferta);
    useEffect(() => {
        if (showAdvancedSearch) {
            setCurrentPage(1);
        }
    }, [showAdvancedSearch]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedArea('');
        setFechaMaxPosFilter('');
    };
    // Cambia de página
    const paginate = (pageNumber:any) => setCurrentPage(pageNumber);

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-center mb-4">
                <FaHandPaper className="text-blue-500 text-2xl mr-2" />
                <h1 className="text-2xl font-semibold text-blue-500">REALIZAR POSTULACIÓN</h1>
            </div>
            <p>En esta sección te mostramos todos las ofertas publicadas por las empresas, puedes postular en cualquier oferta de interes. Recuerda siempre tener generado tu hoja de vida para poder hacerlo </p>
            <hr className="my-4" />
            <div className="flex mb-4">
            <div className="relative flex">
                    <input
                        type="text"
                        className="border border-gray-300 p-2 rounded mr-2 w-full"
                        placeholder="Buscar por cargo"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
                <button
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    onClick={() => {
                        setShowAdvancedSearch(!showAdvancedSearch);
                        if (showAdvancedSearch) {
                            clearFilters();
                        }
                    }}
                >
                    {showAdvancedSearch ? 'Ocultar Búsqueda Avanzada' : 'Búsqueda Avanzada'}
                </button>
            </div>

            {showAdvancedSearch && (
                <div className="mb-4 p-4 border border-gray-300 rounded">
                    <h2 className="text-xl font-semibold mb-4">Búsqueda Avanzada</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="empresa" className="block font-medium text-gray-700">Búsqueda por empresa:</label>
                            <input
                                type="text"
                                id="empresa"
                                className="border border-gray-300 p-2 rounded w-full"
                                placeholder="Buscar por empresa"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="area" className="block mt-4 md:mt-0 font-medium text-gray-700">Búsqueda por área:</label>
                            <select
                                id="area"
                                className="border border-gray-300 p-2 rounded w-full"
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                            >
                                <option value="">Seleccione un área</option>
                                {areas.map(area => (
                                    <option key={area.id} value={area.nombre_area}>
                                        {area.nombre_area}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="fechaMaxPos" className="block mt-4 md:mt-0 font-medium text-gray-700">Búsqueda por fecha máxima de postulación:</label>
                            <input
                                type="date"
                                id="fechaMaxPos"
                                className="border border-gray-300 p-2 rounded w-full"
                                value={fechaMaxPosFilter}
                                onChange={(e) => setFechaMaxPosFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {currentOfertas.length === 0 ? (
                <p>Todavía no se han publicado ofertas.</p>
            ) : (
                <>
                    <hr className="my-4" />
                    <h1 className="text-2xl font-bold mb-4">OFERTAS PUBLICADAS:</h1>
                    <div className="relative overflow-x-auto">
                        <div className="flex flex-col gap-4">
                            {currentOfertas.map((oferta) => (
                                <div key={oferta.id_oferta} className="w-full relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-4 flex justify-between items-center">
                                    <div className="flex-1 pr-4">
                                        <div className="text-center mb-2 flex items-center justify-center">
                                            <FiUser className="text-blue-800 mr-2" size={24} />
                                            <h2 className="text-xl font-bold text-blue-800">{oferta.cargo}</h2>
                                        </div>

                                        <p className="text-gray-700 mb-1"><strong>Empresa:</strong> {oferta.n_mostrar_empresa === 1 ? 'Anónima' : oferta.empresa.nombre_comercial}</p>
                                        <p className="text-gray-700 mb-1"><strong>Área:</strong> {oferta.areas.nombre_area.charAt(0).toUpperCase() + oferta.areas.nombre_area.slice(1).toLowerCase()}</p>
                                        <p className="text-gray-700 mb-1"><strong>Carga Horaria:</strong> {oferta.carga_horaria}</p>
                                        <p className="text-gray-700 mb-1"><strong>Fecha Máxima De Postulación:</strong> {formatFechaMaxPos(oferta.fecha_max_pos)}</p>

                                        <center>
                                            <button
                                                onClick={() => setSelectedOferta(oferta)}
                                                className="flex items-center justify-center bg-green-500  text-white p-2 rounded-lg mt-4"
                                            >
                                                Ver Oferta <FiEye className="ml-2" />
                                            </button>
                                        </center>
                                    </div>

                                    <div className="relative w-80 h-52 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-l from-blue-50 to-transparent"></div>
                                        <img
                                            src={oferta.n_mostrar_empresa === 1 ? '/images/anonima.png' : oferta.empresa.logo}
                                            alt="Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Paginación */}
                    {filteredOfertas.length > ofertasPerPage && (
                        <div className="mt-4 flex justify-end">
                            <nav className="relative z-0 inline-flex shadow-sm rounded-md">
                                <a
                                    href="#"
                                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                >
                                    <span className="sr-only">Anterior</span>
                                    Anterior
                                </a>
                                {Array.from({ length: Math.ceil(filteredOfertas.length / ofertasPerPage) }, (_, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        onClick={() => paginate(i + 1)}
                                        className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === i + 1 ? 'text-blue-500 bg-blue-100' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                    >
                                        {i + 1}
                                    </a>
                                ))}
                                <a
                                    href="#"
                                    onClick={() => paginate(currentPage < Math.ceil(filteredOfertas.length / ofertasPerPage) ? currentPage + 1 : Math.ceil(filteredOfertas.length / ofertasPerPage))}
                                    className={`-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === Math.ceil(filteredOfertas.length / ofertasPerPage) ? 'text-gray-500 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                >
                                    <span className="sr-only">Siguiente</span>
                                    Siguiente
                                </a>
                            </nav>
                            
            {selectedOferta && <Modal oferta={selectedOferta} onClose={() => setSelectedOferta(null)} userId={user?.id} />}
                        </div>
                        
                    )}
                </>
                
            )}
            
        </div>

            
    );
}

export default VerOfertasAll;