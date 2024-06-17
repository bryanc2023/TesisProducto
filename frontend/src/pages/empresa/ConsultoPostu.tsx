import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../services/axios';
import ModalDetail from '../../components/ModalPostu';
import PostulanteDetail from '../../pages/empresa/PostuDeta';
import { RootState } from '../../store';

interface Postulacion {
    id_oferta: number;
    estado_postulacion: string;
    total_evaluacion: number;
    oferta: {
        id_oferta: number;
        cargo: string;
        empresa: {
            nombre_comercial: string;
        };
        postulantes: {
            id_postulante: number;
            nombres: string;
            apellidos: string;
            fecha_nac: string;
            edad: number;
            estado_civil: string;
            cedula: string;
            genero: string;
            informacion_extra: string;
            foto: string;
            cv: string | null;
            total_evaluacion: number;
        }[];
    };
}

const PostulantesList: React.FC = () => {
    const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
    const [selectedPostulante, setSelectedPostulante] = useState<Postulacion | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOfertaId, setSelectedOfertaId] = useState<number | null>(null); // Estado para la oferta seleccionada
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchPostulaciones = async () => {
            try {
                const response = await axios.get(`postulacionesE/${user?.id}`);
                const postulacionesData = transformarRespuesta(response.data.postulaciones);
                setPostulaciones(postulacionesData);
            } catch (error) {
                console.error('Error fetching postulaciones:', error);
            }
        };
    
        if (user?.id) {
            fetchPostulaciones();
        }
    }, [user]);
    
    const handleShowModal = (postulante: any) => {
        setSelectedPostulante(postulante);
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPostulante(null);
    };
    
    const renderEstadoPostulacion = (estado: string) => {
        switch (estado) {
            case 'P':
                return 'Pendiente a revisión';
            case 'A':
                return 'Aceptado';
            case 'R':
                return 'Rechazado';
            default:
                return '-';
        }
    };
    
    // Función para transformar la respuesta de la API en un array de objetos Postulacion
  // Función para transformar la respuesta de la API en un array de objetos Postulacion
const transformarRespuesta = (data: any): Postulacion[] => {
    const postulacionesArray: Postulacion[] = [];

    Object.keys(data).forEach((key) => {
        const ofertaId = parseInt(key);
        const ofertaData = data[key];
        const postulacion: Postulacion = {
            id_oferta: ofertaData.id_oferta,
            estado_postulacion: 'P', // Asumiendo un estado por defecto, ajustar según corresponda
            total_evaluacion: 0, // Asumiendo una valoración por defecto, ajustar según corresponda
            oferta: {
                id_oferta: ofertaData.id_oferta,
                cargo: ofertaData.cargo,
                empresa: {
                    nombre_comercial: 'Nombre de empresa', // Debes obtener este dato de la API si es necesario
                },
                postulantes: ofertaData.postulantes.map((postulante: any) => ({
                    id_postulante: postulante.id_postulante,
                    nombres: postulante.nombres,
                    apellidos: postulante.apellidos,
                    fecha_nac: postulante.fecha_nac,
                    edad: postulante.edad,
                    estado_civil: postulante.estado_civil,
                    cedula: postulante.cedula,
                    genero: postulante.genero,
                    informacion_extra: postulante.informacion_extra,
                    foto: postulante.foto,
                    cv: postulante.cv,
                    total_evaluacion: postulante.total_evaluacion,
                })),
            },
        };

        postulacionesArray.push(postulacion);
    });

    return postulacionesArray;
};

// Función para obtener las opciones del select box
const ofertaOptions = postulaciones.map((postulacion, index) => (
    <option key={index} value={postulacion.id_oferta}>
        Oferta {index + 1}: {postulacion.oferta.cargo}
    </option>
));

// Función para filtrar las postulaciones por la oferta seleccionada
const filteredPostulaciones = selectedOfertaId
    ? postulaciones.find(postulacion => postulacion.id_oferta === selectedOfertaId)
    : null;
    return (
        <div className="w-full p-4">
            <div className="mb-4">
                <label htmlFor="selectOferta" className="mr-2 font-semibold">Selecciona una oferta:</label>
                <select
                    id="selectOferta"
                    className="px-2 py-1 border border-gray-300 rounded"
                    value={selectedOfertaId || ''}
                    onChange={(e) => setSelectedOfertaId(parseInt(e.target.value) || null)}
                >
                    <option value="">Todas las ofertas</option>
                    {ofertaOptions}
                </select>
            </div>

            {filteredPostulaciones ? (
               
                <div key={filteredPostulaciones.oferta.id_oferta} className="mb-8">
                    <h1 className="text-2xl font-semibold mb-4"> Te presentamos un top 3 de mejores postulantes para ti:</h1>
                    <h1 className="text-2xl font-semibold mb-4">{filteredPostulaciones.oferta.cargo}:</h1>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Nombre</th>
                                    <th scope="col" className="py-3 px-6">Estado</th>
                                    <th scope="col" className="py-3 px-6">Valoración</th>
                                    <th scope="col" className="py-3 px-6">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPostulaciones.oferta.postulantes.map((postulante) => (
                                    <tr key={postulante.id_postulante} className="bg-gray-100 hover:bg-gray-200">
                                        <td className="py-4 px-6">{`${postulante.nombres} ${postulante.apellidos}`}</td>
                                        <td className="py-4 px-6">{renderEstadoPostulacion(filteredPostulaciones.estado_postulacion)}</td>
                                        <td className="py-4 px-6">{postulante.total_evaluacion}</td>
                                        <td className="py-4 px-6">
                                            <button onClick={() => handleShowModal(postulante)} className="text-blue-600 hover:text-blue-800">Ver Detalles</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p>No hay postulaciones para la oferta seleccionada.</p>
            )}

            {/* Modal */}
            {selectedPostulante && (
                <ModalDetail show={showModal} onClose={handleCloseModal}>
                    <PostulanteDetail 
                        postulante={selectedPostulante} 
                        onClose={handleCloseModal} 
                    />
                </ModalDetail>
            )}
        </div>
    );
};

export default PostulantesList;