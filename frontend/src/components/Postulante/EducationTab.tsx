import React from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

interface EducationTabProps {
  formaciones: Formacion[];
  openEditFormacionModal: (formacion: Formacion | null) => void;
  handleDeleteFormacion: (id: number) => void;
}

interface Formacion {
  id: number;
  institucion: string;
  estado: string;
  fechaini: string;
  fechafin: string;
  titulo: {
    titulo: string;
    nivel_educacion: string;
    campo_amplio: string;
  };
}

const EducationTab: React.FC<EducationTabProps> = ({ formaciones, openEditFormacionModal, handleDeleteFormacion }) => (
  <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Formación Académica</h2>
      <button onClick={() => openEditFormacionModal(null)} className="text-orange-400 hover:underline">
        + Agregar educación
      </button>
    </div>
    {formaciones.length > 0 ? (
      formaciones.map((formacion, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-700 relative">
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => openEditFormacionModal(formacion)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
            >
              <FaPencilAlt className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteFormacion(formacion.id)}
              className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-rose-300 mr-2"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
          <p><strong>Institución:</strong> {formacion.institucion}</p>
          <p><strong>Estado:</strong> {formacion.estado}</p>
          <p><strong>Fecha de Inicio:</strong> {formacion.fechaini}</p>
          <p><strong>Fecha de Fin:</strong> {formacion.fechafin}</p>
          <p><strong>Título:</strong> {formacion.titulo.titulo}</p>
          <p><strong>Nivel de Educación:</strong> {formacion.titulo.nivel_educacion}</p>
          <p><strong>Campo Amplio:</strong> {formacion.titulo.campo_amplio}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No hay formación académica disponible en este momento.</p>
    )}
    <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => openEditFormacionModal(null)}>
      <span className="text-gray-400">Agrega tu formación</span>
    </div>
  </div>
);

export default EducationTab;
