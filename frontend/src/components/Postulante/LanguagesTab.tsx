import React from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

interface LanguagesTabProps {
  idiomas: Idioma[];
  openEditLanguageModal: (idioma: Idioma) => void;
  openModal: (content: string) => void;
}

interface Idioma {
  nivel_oral: string;
  nivel_escrito: string;
  idioma: {
    id: number;
    nombre: string;
  } | null;
}

const LanguagesTab: React.FC<LanguagesTabProps> = ({ idiomas, openEditLanguageModal, openModal }) => (
  <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold mb-4">Idiomas</h3>
      <button onClick={() => openModal('idioma')} className="text-orange-400 hover:underline">
        + Agregar idioma
      </button>
    </div>
    {idiomas.length > 0 ? (
      idiomas.map((idioma, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-700 relative">
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => openEditLanguageModal(idioma)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
            >
              <FaPencilAlt className="w-4 h-4" />
            </button>
            <button
              className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-rose-300 mr-2"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
          <p><strong>Idioma:</strong> {idioma.idioma?.nombre}</p>
          <p><strong>Nivel Oral:</strong> {idioma.nivel_oral}</p>
          <p><strong>Nivel Escrito:</strong> {idioma.nivel_escrito}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No hay idiomas disponibles en este momento.</p>
    )}
    <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('idioma')}>
      <span className="text-gray-400">Agrega tu idioma</span>
    </div>
  </div>
);

export default LanguagesTab;
