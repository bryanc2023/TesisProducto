import React from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

interface CoursesTabProps {
  cursos: Curso[];
  openEditCursoModal: (curso: Curso | null) => void;
  handleDeleteCurso: (id: number) => void;
}

interface Curso {
  id: number;
  nombre: string;
  institucion: string;
  fechaini: string;
  fechafin: string;
  certificado: string;
}

const CoursesTab: React.FC<CoursesTabProps> = ({ cursos = [], openEditCursoModal, handleDeleteCurso }) => (
  <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Cursos y Capacitaciones</h2>
      <button onClick={() => openEditCursoModal(null)} className="text-orange-400 hover:underline">
        + Agregar curso
      </button>
    </div>
    {cursos.length > 0 ? (
      cursos.map((curso, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-700 relative">
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => openEditCursoModal(curso)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
            >
              <FaPencilAlt className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteCurso(curso.id)}
              className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-rose-300 mr-2"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
          <p><strong>Nombre del Curso:</strong> {curso.nombre}</p>
          <p><strong>Institución:</strong> {curso.institucion}</p>
          <p><strong>Fecha de Inicio:</strong> {curso.fechaini}</p>
          <p><strong>Fecha de Fin:</strong> {curso.fechafin}</p>
          <p><strong>Certificado:</strong> <a href={curso.certificado} className="text-blue-400 hover:underline">Ver certificado</a></p>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No hay cursos ni capacitaciones disponibles en este momento.</p>
    )}
    <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => openEditCursoModal(null)}>
      <span className="text-gray-400">Agrega tu curso</span>
    </div>
  </div>
);

export default CoursesTab;
