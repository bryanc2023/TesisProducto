import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ModalDetail from '../../components/ModalPostu';
import PostulanteDetail from '../../pages/empresa/PostuDeta';
// Define el tipo para los postulantes
// Define el tipo para los postulantes
interface Postulante {
    id: number;
    nombre: string;
    puesto: string;
    empresa: string;
    fechaPublicacion: string;
    ubicacion: string;
    experienciaMinima: string;
    cargaHoraria: string;
    fechaMaxPostulacion: string;
    modalidad: string;
    nivelInstruccion: string;
    objetivo: string;
    funciones: string;
    habilidades: string;
    conocimientos: string;
    descripcion: string;
    contacto: string;
    telefono: string;
    direccion: string;
    fechaNacimiento: string;
    educacion: string;
    experiencia: string;
    referencias: string;
}

const PostulantesList: React.FC = () => {
    const [postulantes, setPostulantes] = useState<Postulante[]>([]);
    const [selectedPostulante, setSelectedPostulante] = useState<Postulante | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Aquí iría la lógica para obtener la lista de postulantes desde el backend
        setPostulantes([
            { id: 1, nombre: 'Juan Pérez', puesto: 'Desarrollador Web', empresa: 'Empresa #1', fechaPublicacion: '01/01/2023', ubicacion: 'Remoto', experienciaMinima: '2 años', cargaHoraria: '40 horas/semana', fechaMaxPostulacion: '31/12/2023', modalidad: 'Remoto', nivelInstruccion: 'Universitario', objetivo: 'Desarrollar aplicaciones web.', funciones: 'Desarrollar y mantener aplicaciones web.', habilidades: 'React, Node.js', conocimientos: 'JavaScript, CSS', descripcion: 'Ninguna', contacto: 'juan@example.com', telefono: '1234567890', direccion: 'Calle Falsa 123', fechaNacimiento: '1990-01-01', educacion: 'Universitario', experiencia: '2 años', referencias: 'Referencia 1' },
            { id: 2, nombre: 'María Gómez', puesto: 'Diseñadora UX', empresa: 'Empresa #2', fechaPublicacion: '01/01/2023', ubicacion: 'Presencial', experienciaMinima: '3 años', cargaHoraria: '40 horas/semana', fechaMaxPostulacion: '31/12/2023', modalidad: 'Presencial', nivelInstruccion: 'Universitario', objetivo: 'Diseñar interfaces de usuario.', funciones: 'Crear prototipos y diseños.', habilidades: 'Figma, Sketch', conocimientos: 'Diseño UX/UI', descripcion: 'Ninguna', contacto: 'maria@example.com', telefono: '0987654321', direccion: 'Avenida Siempre Viva 742', fechaNacimiento: '1992-02-02', educacion: 'Universitario', experiencia: '3 años', referencias: 'Referencia 2' },
            // Más postulantes...
        ]);
    }, []);

    const handleShowModal = (postulante: Postulante) => {
        setSelectedPostulante(postulante);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPostulante(null);
    };

    const handleAccept = () => {
        // Lógica para aceptar el postulante
        console.log(`Postulante ${selectedPostulante?.nombre} aceptado`);
        handleCloseModal();
    };

    const handleReject = () => {
        // Lógica para rechazar el postulante
        console.log(`Postulante ${selectedPostulante?.nombre} rechazado`);
        handleCloseModal();
    };

    return (
        <div className="w-full p-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <h1 className="text-2xl font-semibold mb-4">Postulantes Disponibles:</h1>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="py-3 px-6">ID</th>
                            <th scope="col" className="py-3 px-6">Nombre</th>
                            <th scope="col" className="py-3 px-6">Puesto</th>
                            <th scope="col" className="py-3 px-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postulantes.map((postulante) => (
                            <tr key={postulante.id} className="bg-gray-100 hover:bg-gray-200">
                                <td className="py-4 px-6">{postulante.id}</td>
                                <td className="py-4 px-6">{postulante.nombre}</td>
                                <td className="py-4 px-6">{postulante.puesto}</td>
                                <td className="py-4 px-6">
                                    <button onClick={() => handleShowModal(postulante)} className="text-blue-600 hover:text-blue-800">Ver Detalles</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedPostulante && (
                <ModalDetail show={showModal} onClose={handleCloseModal}>
                    <PostulanteDetail 
                        postulante={selectedPostulante} 
                        onAccept={handleAccept} 
                        onReject={handleReject} 
                    />
                </ModalDetail>
            )}
        </div>
    );
};

export default PostulantesList;