import React from 'react';

interface ExperienceTabProps {
  openModal: (content: string) => void;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ openModal }) => (
  <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold mb-4">Experiencia</h3>
      <button onClick={() => openModal('experiencia')} className="text-orange-400 hover:underline">
        + Agregar experiencia
      </button>
    </div>
    <p className="text-gray-400">No hay experiencia disponible en este momento.</p>
    <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('experiencia')}>
      <span className="text-gray-400">Agrega tu experiencia</span>
    </div>
  </div>
);

export default ExperienceTab;
