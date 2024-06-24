import React, { useState, useEffect } from 'react';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


interface Resultado {
    postulacion:{
    id_oferta: number;
    id_postulante: number;
    fecha_postulacion: string;
    fecha_revision: string | null;
    estado_postulacion: string;
    comentario: string | null;
    total_evaluacion: number;
    oferta: {
        id_oferta: number;
        id_empresa: number;
        id_area: number;
        cargo: string;
        experiencia: number;
        objetivo_cargo: string;
        sueldo: number;
        funciones: string;
        carga_horaria: string;
        modalidad: string;
        fecha_publi: string;
        fecha_max_pos: string;
        detalles_adicionales: string;
        correo_contacto: string | null;
        numero_contacto: string | null;
        estado: string;
        n_mostrar_sueldo: number;
        n_mostrar_empresa: number;
        empresa:{
            nombre_comercial:string;
        };
    };
   
};
ubicacion:{
provincia:string;
canton:string;
};
}

function ResultadosP() {
    const [resultados, setResultados] = useState<Resultado[]>([]);
    const [modalOpen, setModalOpen] = useState(false); // Estado del modal
    const [selectedPostulacion, setSelectedPostulacion] = useState<Resultado | null>(null); // Estado para almacenar la postulación seleccionada
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchResultados = async () => {
            try {
                const response = await axios.get(`postulaciones/${user?.id}`);
                setResultados(response.data.postulaciones);
            } catch (error) {
                console.error('Error fetching resultados:', error);
                // Manejo de errores: podrías mostrar un mensaje de error al usuario
            }
        };

        fetchResultados();
    }, [user?.id]);

    const renderEstadoPostulacion = (estado: string) => {
        switch (estado) {
            case 'P':
                return 'Pendiente';
            case 'A':
                return 'Aceptado';
            case 'R':
                return 'Rechazado';
            default:
                return '-';
        }
    };

    const openModal = (postulacion: Resultado) => {
        setSelectedPostulacion(postulacion);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedPostulacion(null);
        setModalOpen(false);
    };

    return (
        <div className="w-full p-4">
            <h1 className="text-2xl font-semibold mb-4">Consulta de Resultados:</h1>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="py-3 px-6">Cargo</th>
                            <th className="py-3 px-6">Empresa</th>
                            <th className="py-3 px-6">Ubicación</th>
                            <th className="py-3 px-6">Estado</th>
                            <th className="py-3 px-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map((resultado) => (
                            <tr key={resultado.postulacion.id_oferta}>
                                <td className="py-3 px-6">{resultado.postulacion.oferta.cargo}</td>
                                <td className="py-3 px-6">{resultado.postulacion.oferta.n_mostrar_empresa === 1 ? 'Anónima' : resultado.postulacion.oferta.empresa.nombre_comercial}</td>
                                <td className="py-3 px-6">{resultado.ubicacion.provincia}, {resultado.ubicacion.canton}</td>
                                <td className="py-3 px-6">{renderEstadoPostulacion(resultado.postulacion.estado_postulacion)}</td>
                                <td className="py-3 px-6">
                                    <button className="text-blue-500 hover:text-blue-700" onClick={() => openModal(resultado)}>Ver detalles</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para mostrar detalles de la postulación */}
            {selectedPostulacion && (
                <div className={`fixed z-10 inset-0 overflow-y-auto ${modalOpen ? 'block' : 'hidden'}`}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Detalles de la postulación</h3>
                                <div className="mt-5">
                                    <p><span className="font-medium">Cargo:</span> {selectedPostulacion.postulacion.oferta.cargo}</p>
                                    <p><span className="font-medium">Empresa:</span> {selectedPostulacion.postulacion.oferta.empresa.nombre_comercial}</p>
                                    <p><span className="font-medium">Ubicación:</span> {selectedPostulacion.ubicacion.provincia}, {selectedPostulacion.ubicacion.canton}</p>
                                    <p><span className="font-medium">Estado:</span> {renderEstadoPostulacion(selectedPostulacion.postulacion.estado_postulacion)}</p>
                                    {/* Agregar más detalles según sea necesario */}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button onClick={closeModal} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResultadosP;