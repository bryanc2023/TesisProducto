import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PostulanteDetailProps {
    postulante: {
        id_postulante:number;
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
    };
    onClose: () => void;
}

const PostulanteDetail: React.FC<PostulanteDetailProps> = ({ postulante, onClose }) => {
    const navigate = useNavigate();
    const verPerfil = () => {
        navigate(`/perfildet/${postulante.id_postulante}`); // Navega a la ruta con el id_postulante
    };

    return (
        <div className="p-4 bg-white text-gray-900 rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Detalles del Postulante</h1>
            <div className="flex items-center justify-center mb-4">
                <img src={postulante.foto} alt="Foto del postulante" className="w-32 h-32 object-cover rounded-full" />
            </div>
            <div className="mb-4">
                <p className="text-gray-900 mb-2"><span className="font-bold">Nombre:</span> {postulante.nombres} {postulante.apellidos}</p>
                <p className="text-gray-900 mb-2"><span className="font-bold">Edad:</span> {postulante.edad}</p>
                <p className="text-gray-900 mb-2"><span className="font-bold">Estado civil:</span> {postulante.estado_civil}</p>
                <p className="text-gray-900 mb-2"><span className="font-bold">Género:</span> {postulante.genero}</p>
                <p className="text-gray-900 mb-2"><span className="font-bold">Información extra:</span> {postulante.informacion_extra}</p>
            </div>
            {postulante.cv && (
                <div className="mb-4">
                    <p className="text-gray-900 mb-2">
                        <span className="font-bold">CV:</span>
                        <a href={postulante.cv} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-2">Descargar CV</a>
                    </p>
                </div>
            )}
            <div className="flex justify-end mt-4">
            <button
                    onClick={verPerfil} // Aquí llamas a la función que manejará la redirección
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                >
                    Todos los detalles
                </button>
                <button
                    onClick={onClose}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};



export default PostulanteDetail;
