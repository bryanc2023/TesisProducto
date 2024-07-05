import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { FiEdit, FiPlus, FiEye } from 'react-icons/fi';
import { FaBriefcase } from 'react-icons/fa';


interface Oferta {
    id_oferta: number;
    estado: string;
    cargo: string;
    areas: {
        nombre_area: string;
    };
    fecha_publi: string;
    modalidad: string;
    carga_horaria: string;
    experiencia: number;
    mostrar_empresa: number;
    criterios: Criterio[];
    expe: Experiencia[];
    // Define otros campos de la oferta según sea necesario
}

interface Criterio {
    id_criterio: number;
    criterio: string;
    descripcion: string;
    pivot: {
        valor: string;
    };
}

interface Experiencia {
    id: number;
    nivel_educacion: string;
    campo_amplio: string;
    titulo: string;
}

function VerOfertasPPage() {
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null); // Estado para almacenar la oferta seleccionada
    const [selectedFecha, setSelectedFecha] = useState<string>(''); // Estado para almacenar la fecha seleccionada
    const { user } = useSelector((state: RootState) => state.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const [ofertasPerPage] = useState(5);

    useEffect(() => {
        fetchOfertas();
    }, []);

    const fetchOfertas = async () => {
        if (user) {
            try {
                const response = await axios.get(`empresa/${user.id}/ofertas`); // Reemplaza con tu URL y ID de empresa
                setOfertas(response.data.ofertas);
            } catch (error) {
                console.error('Error fetching ofertas:', error);
            }
        }
    };

    // Función para mostrar los detalles de la oferta seleccionada en el modal
    const handleVerDetalles = (oferta: Oferta) => {
        setSelectedOferta(oferta);
        // Lógica para mostrar el modal aquí (puedes usar estados, context, etc.)
    };

    // Función para cerrar el modal de detalles
    const handleCloseModal = () => {
        setSelectedOferta(null);
    };

    // Función para filtrar ofertas por fecha de publicación
    const handleFilterByFecha = async () => {
        try {
            const response = await axios.get(`empresa/${user?.id}/ofertas`, {
                params: {
                    fecha_publi: selectedFecha,
                },
            });
            setOfertas(response.data.ofertas);
        } catch (error) {
            console.error('Error filtering ofertas:', error);
        }
    };

    // Calcula las ofertas a mostrar en la página actual
    const indexOfLastOferta = currentPage * ofertasPerPage;
    const indexOfFirstOferta = indexOfLastOferta - ofertasPerPage;
    const currentOfertas = ofertas.slice(indexOfFirstOferta, indexOfLastOferta);


    return (
        <div className="w-full p-4">
            <div className="mb-4 text-center max-w-screen-lg mx-auto">
                <h1 className="text-3xl font-bold mb-4 flex justify-center items-center text-orange-500 ml-2">
                    GESTIÓN DE OFERTAS
                    <FiEdit className="text-orange-500 ml-2" />
                </h1>
                <p>En esta sección te mostramos todas las ofertas creadas hasta el momento, puedes seleccionar una fecha de publicación para filtrar la lista de ofertas publicadas manejarte de mejor manera</p>
    
                <div className="flex justify-center items-center mt-4 space-x-4">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md max-w-xl text-center flex-grow">
                        <div className="flex items-center mb-4 space-x-5">
                            <label htmlFor="selectFecha" className="mr-2 font-semibold text-orange-500">Selecciona una fecha de publicación:</label>
                            <input
                                type="date"
                                id="selectFecha"
                                className="px-2 py-1 border border-gray-300 rounded"
                                value={selectedFecha}
                                onChange={(e) => setSelectedFecha(e.target.value)}
                            />
                            <button
                                onClick={handleFilterByFecha}
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                            >
                                Filtrar
                            </button>
                        </div>
                    </div>
    
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md max-w-xl text-center">
                        <Link to="/add-oferta" className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 flex items-center justify-center">
                            <FiPlus className="mr-2" /> Publicar Nueva Oferta
                        </Link>
                    </div>
                </div>
            </div>
            {ofertas.length > 0 ? (
                <>
                    <hr className="my-4" />
                    <div className="flex items-center justify-center mb-4 max-w-screen-lg mx-auto">
                        <FaBriefcase className="text-blue-500 text-2xl mr-2" />
                        <h1 className="text-2xl font-semibold text-blue-500">OFERTAS PUBLICADAS:</h1>
                    </div>
    
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-screen-lg mx-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Cargo</th>
                                    <th scope="col" className="py-3 px-6">Estado</th>
                                    <th scope="col" className="py-3 px-6">Fecha Publicación</th>
                                    <th scope="col" className="py-3 px-6">Área</th>
                                    <th scope="col" className="py-3 px-6">Carga Horaria</th>
                                    <th scope="col" className="py-3 px-6">Experiencia Mínima</th>
                                    <th scope="col" className="py-3 px-6">Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOfertas.map((oferta) => (
                                    <tr key={oferta.id_oferta}>
                                        <td className="py-4 px-6">{oferta.cargo}</td>
                                        <td className={`py-4 px-6 ${oferta.estado === 'Culminada' ? 'bg-green-100' : (oferta.estado === 'En espera' ? 'bg-blue-100' : '')}`}>
                                            {oferta.estado}
                                        </td>
                                        <td className="py-4 px-6">{oferta.fecha_publi}</td>
                                        <td className="py-4 px-6">{oferta.areas.nombre_area}</td>
                                        <td className="py-4 px-6">{oferta.carga_horaria}</td>
                                        <td className="py-4 px-6">{oferta.experiencia === 0 ? 'No requerida' : `${oferta.experiencia} año/s`}</td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => handleVerDetalles(oferta)}
                                                className="flex items-center text-blue-600 hover:text-blue-900"
                                            >
                                                <FiEye className="w-4 h-4 mr-1" /> Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
    
                    {ofertas.length > ofertasPerPage && (
                        <div className="mt-4 flex justify-end max-w-screen-lg mx-auto">
                            <nav className="relative z-0 inline-flex shadow-sm rounded-md">
                                <a
                                    href="#"
                                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-slate-950 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                >
                                    <span className="sr-only">Anterior</span>
                                    Anterior
                                </a>
                                {Array.from({ length: Math.ceil(ofertas.length / ofertasPerPage) }, (_, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === index + 1 ? 'bg-neutral-900 text-white' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                    >
                                        {index + 1}
                                    </a>
                                ))}
                                <a
                                    href="#"
                                    onClick={() => setCurrentPage(currentPage < Math.ceil(ofertas.length / ofertasPerPage) ? currentPage + 1 : Math.ceil(ofertas.length / ofertasPerPage))}
                                    className={`-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === Math.ceil(ofertas.length / ofertasPerPage) ? 'text-gray-500 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                >
                                    <span className="sr-only">Siguiente</span>
                                    Siguiente
                                </a>
                            </nav>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center mt-4">
                    <p className="text-lg text-gray-600">Aún no has publicado ninguna oferta.</p>
                </div>
            )}
    
            {selectedOferta && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-auto bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-3xl w-full overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4"><center>{selectedOferta.cargo}</center></h2>
                        <p><strong>Estado:</strong> {selectedOferta.estado}</p>
                        <p><strong>Fecha de Publicación:</strong> {selectedOferta.fecha_publi}</p>
                        <p><strong>Área: </strong>{selectedOferta.areas.nombre_area}</p>
                        <p><strong>Carga Horaria: </strong>{selectedOferta.carga_horaria}</p>
                        <p><strong>Experiencia Mínima: </strong>{selectedOferta.experiencia}</p>
    
                        {selectedOferta.criterios.length > 0 && (
                            <>
                                <h3 className="text-lg font-semibold mt-4 mb-2">Criterios:</h3>
                                <ul className="list-disc pl-6">
                                    {selectedOferta.criterios.map((criterio) => (
                                        <li key={criterio.id_criterio}>
                                            <strong>{criterio.criterio}:</strong> {criterio.pivot.valor}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
    
                        {selectedOferta.expe.length > 0 && (
                            <>
                                <h3 className="text-lg font-semibold mt-4 mb-2">Experiencia:</h3>
                                <ul className="list-disc pl-6">
                                    {selectedOferta.expe.map((experiencia) => (
                                        <li key={experiencia.id}>
                                            <strong>{experiencia.titulo}</strong> - {experiencia.nivel_educacion} en {experiencia.campo_amplio}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
    
                        {selectedOferta.criterios.length === 0 && selectedOferta.expe.length === 0 && (
                            <p className="mt-4">Ningún criterio o experiencia especificada para esta oferta.</p>
                        )}
    
                        <button
                            onClick={handleCloseModal}
                            className="bg-gray-300 text-gray-700 py-2 px-4 mt-4 rounded hover:bg-gray-400"
                        >
                            Cerrar Detalles
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
    
}

export default VerOfertasPPage;
