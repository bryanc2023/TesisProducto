import React from 'react';
import PropTypes from 'prop-types';

interface Postulante {
    nombre: string;
    contacto: string;
    telefono: string;
    direccion: string;
    fechaNacimiento: string;
    educacion: string;
    experiencia: string;
    habilidades: string;
    referencias: string;
}

interface PostulanteDetailProps {
    postulante: Postulante;
    onAccept: () => void;
    onReject: () => void;
}

const PostulanteDetail: React.FC<PostulanteDetailProps> = ({ postulante, onAccept, onReject }) => {
    return (
        <div className="p-4 bg-white text-gray-900 rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">POSTULANTE: {postulante.nombre}</h1>
            <div className="mb-4">
                <p className="text-gray-900 mb-2"><span className="font-bold">Nombre:</span> {postulante.nombre}</p>
                <p className="text-gray-900 mb-2"><span className="font-bold">Correo de contacto:</span> {postulante.contacto}</p>
                <p className="text-gray-900 mb-2"><span className="font-bold">Teléfono:</span> {postulante.telefono}</p>
                <p className="text-gray-900 mb-2"><span className="font-bold">Dirección:</span> {postulante.direccion}</p>
                <p className="text-gray-900 mb-2"><span className="font-bold">Fecha de Nacimiento:</span> {postulante.fechaNacimiento}</p>
            </div>
            <div className="mb-4">
                <p className="text-gray-900 mb-2"><span className="font-bold">Educación:</span></p>
                <p className="text-gray-900 mb-2">{postulante.educacion}</p>
            </div>
            <div className="mb-4">
                <p className="text-gray-900 mb-2"><span className="font-bold">Experiencia:</span></p>
                <p className="text-gray-900 mb-2">{postulante.experiencia}</p>
            </div>
            <div className="mb-4">
                <p className="text-gray-900 mb-2"><span className="font-bold">Habilidades:</span></p>
                <p className="text-gray-900 mb-2">{postulante.habilidades}</p>
            </div>
            <div className="mb-4">
                <p className="text-gray-900 mb-2"><span className="font-bold">Referencias:</span></p>
                <p className="text-gray-900 mb-2">{postulante.referencias}</p>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    onClick={onReject}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2"
                >
                    Rechazar
                </button>
                <button
                    onClick={onAccept}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
};

PostulanteDetail.propTypes = {
    postulante: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        contacto: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        direccion: PropTypes.string.isRequired,
        fechaNacimiento: PropTypes.string.isRequired,
        educacion: PropTypes.string.isRequired,
        experiencia: PropTypes.string.isRequired,
        habilidades: PropTypes.string.isRequired,
        referencias: PropTypes.string.isRequired
    }).isRequired,
    onAccept: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired
};

export default PostulanteDetail;
