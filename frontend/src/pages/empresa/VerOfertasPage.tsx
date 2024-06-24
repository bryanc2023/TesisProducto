import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { RootState } from '../../store';
import { useSelector } from 'react-redux';



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
    const { user } = useSelector((state: RootState) => state.auth);

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
   // Renderización del componente de lista de ofertas
   return (
    <div className="w-full p-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">OFERTAS PUBLICADAS:</h1>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="py-3 px-6">Cargo</th>
                        <th scope="col" className="py-3 px-6">Estado</th>
                        <th scope="col" className="py-3 px-6">Fecha Publicacion</th>
                        <th scope="col" className="py-3 px-6">Área</th>
                        <th scope="col" className="py-3 px-6">Carga Horaria</th>
                        <th scope="col" className="py-3 px-6">Experiencia Mínima</th>
                        <th scope="col" className="py-3 px-6">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ofertas.map((oferta) => (
                        <tr key={oferta.id_oferta}>
                            <td className="py-4 px-6">{oferta.cargo}</td>
                            <td className="py-4 px-6">{oferta.estado}</td>
                            <td className="py-4 px-6">{oferta.fecha_publi}</td>
                            <td className="py-4 px-6">{oferta.areas.nombre_area}</td>
                            <td className="py-4 px-6">{oferta.carga_horaria}</td>
                            <td className="py-4 px-6">{oferta.experiencia === 0 ? 'No requerida' : `${oferta.experiencia} año/s`}</td>
                            <td className="py-4 px-6">
                                <button
                                    onClick={() => handleVerDetalles(oferta)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Ver Detalles
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <Link to="/add-oferta" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Agregar Nueva Oferta</Link>
        </div>

        {/* Mostrar detalles de la oferta seleccionada */}
       
           {selectedOferta && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-auto bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-3xl w-full overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4"><center>{selectedOferta.cargo}</center></h2>
                        <p><strong>Estado:</strong> {selectedOferta.estado}</p>
                        <p><strong>Fecha de Publicación:</strong> {selectedOferta.fecha_publi}</p>
                        <p><strong>Área: </strong>{selectedOferta.areas.nombre_area}</p>
                        <p><strong>Carga Horaria: </strong>{selectedOferta.carga_horaria}</p>
                        <p><strong>Experiencia Mínima: </strong>{selectedOferta.experiencia}</p>

                        {/* Mostrar criterios si existen */}
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

                        {/* Mostrar experiencia si existe */}
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

                        {/* Mostrar 'Ninguno' si no hay criterios ni experiencia */}
                        {selectedOferta.criterios.length === 0 && selectedOferta.expe.length === 0 && (
                            <p className="mt-4">Ningún criterio o experiencia especificada para esta oferta.</p>
                        )}

                        {/* Botón para cerrar el modal */}
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