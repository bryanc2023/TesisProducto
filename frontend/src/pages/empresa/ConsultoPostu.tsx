import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../services/axios';
import ModalDetail from '../../components/ModalPostu';
import PostulanteDetail from '../../pages/empresa/PostuDeta';
import { RootState } from '../../store';
import jszip from 'jszip';
import FileSaver from 'file-saver';
import {getStorage, ref, getDownloadURL } from 'firebase/storage';
import {storage } from '../../config/firebaseConfig';

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
            fecha:string;
        }[];
    };
}

const PostulantesList: React.FC = () => {
    const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
    const [selectedPostulante, setSelectedPostulante] = useState<Postulacion | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOfertaId, setSelectedOfertaId] = useState<number | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const [numCVs, setNumCVs] = useState<number>(3);

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

    const transformarRespuesta = (data: any): Postulacion[] => {
        const postulacionesArray: Postulacion[] = [];

        Object.keys(data).forEach((key) => {
            const ofertaId = parseInt(key);
            const ofertaData = data[key];
            const postulacion: Postulacion = {
                id_oferta: ofertaData.id_oferta,
                estado_postulacion: 'P',
                total_evaluacion: 0,
                oferta: {
                    id_oferta: ofertaData.id_oferta,
                    cargo: ofertaData.cargo,
                    empresa: {
                        nombre_comercial: 'Nombre de empresa',
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
                        fecha:postulante.fecha,
                    })),
                },
            };

            postulacionesArray.push(postulacion);
        });

        return postulacionesArray;
    };

    const ofertaOptions = postulaciones.map((postulacion, index) => (
        <option key={index} value={postulacion.id_oferta}>
            Oferta {index + 1}: {postulacion.oferta.cargo}
        </option>
    ));

    const filteredPostulaciones = selectedOfertaId
        ? postulaciones.find(postulacion => postulacion.id_oferta === selectedOfertaId)
        : null;

        const descargarCVs = async () => {
            if (!filteredPostulaciones) return;
        
            const zip = new jszip();
            const promises = [];
        
            filteredPostulaciones.oferta.postulantes.slice(0, numCVs).forEach((postulante, index) => {
                const nombreArchivo = `${index + 1}-${postulante.nombres}-${postulante.apellidos}.pdf`;
        
                if (postulante.cv) {
                    //const storageRef = ref(storage, postulante.cv);
                    // Create a reference to the file we want to download
const storage = getStorage();
const starsRef = ref(storage, postulante.cv);
                    promises.push(
                        getDownloadURL(starsRef).then(url => {
                            console.log("URL de descarga:", url);
                            return fetch(url)
                                .then(response => response.blob())
                                .then(blob => {
                                    zip.file(nombreArchivo, blob, { binary: true });
                                })
                                .catch(error => {
                                    console.error("Error al obtener el archivo:", error);
                                });
                        }).catch(error => {
                            console.error("Error al obtener URL de descarga:", error);
                        })
                    );
                }
            });
        
            await Promise.all(promises);
        
            const nombreZip = `CVs_${filteredPostulaciones.oferta.cargo}.zip`;

        zip.generateAsync({ type: 'blob' }).then((content) => {
            FileSaver.saveAs(content, nombreZip);
        });
        };

    return (
        <div className="w-full p-4">
            <div className="mb-4">
            <>
                <p > En esta sección te mostramos todos los postulantes para cada oferta, para mejor visibilidad selecciona una oferta y veras las mejoras postulaciones para cada oferta</p>
                </>
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
                <>
                 <span className="ml-4 mr-2 font-semibold">Número de CVs a descargar:</span>
                            <input
                                type="number"
                                min="1"
                                max={filteredPostulaciones.oferta.postulantes.length}
                                value={numCVs}
                                onChange={(e) => setNumCVs(parseInt(e.target.value))}
                                className="border border-gray-300 rounded px-2 py-1 w-16 text-center"
                            />
                            <button onClick={descargarCVs} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded">
                                Descargar
                            </button>
                <div key={filteredPostulaciones.oferta.id_oferta} className="mb-8">
                    <h1 className="text-2xl font-semibold mb-4">Te presentamos un top 3 de mejores postulantes para ti:</h1>
                    <h1 className="text-2xl font-semibold mb-4">{filteredPostulaciones.oferta.cargo}:</h1>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-6">Nombre</th>
                                    <th scope="col" className="py-3 px-6">Estado</th>
                                    <th scope="col" className="py-3 px-6">Valoración Del CV</th>
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
                </>
            ) : (
                
                postulaciones.map((postulacion) => (
                    <>
                   
                    <div key={postulacion.id_oferta} className="mb-8">
                        <h1 className="text-2xl font-semibold mb-4">Oferta: {postulacion.oferta.cargo}</h1>
                        <p>Para esta oferta te mostramos todos los postulantes:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {postulacion.oferta.postulantes.map((postulante) => (
                                <div key={postulante.id_postulante} className="p-6 bg-white rounded-lg shadow-lg flex items-center">
                                    <img src={postulante.foto} alt={`Foto de ${postulante.nombres}`} className="w-30 h-20  mr-4" />
                                    <div>
                                        <h2 className="text-sm font-bold mb-2 text-orange-500">Postulante:</h2><p  className="text-sm font-bold mb-2 text-blue-500">{`${postulante.nombres} ${postulante.apellidos}`}</p> 
                                        <p className="text-sm"><strong>Estado:</strong> {renderEstadoPostulacion(postulacion.estado_postulacion)}</p>
                                        <p className="text-sm"><strong>Calificación de CV:</strong> {postulante.total_evaluacion}</p>
                                        <p className="text-sm"><strong>Fecha de postulación:</strong> {postulante.fecha}</p>
                                        <button onClick={() => handleShowModal(postulante)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm">Ver Detalles</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                    </>
                ))
                
            )}

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
