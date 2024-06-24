import React, { useState } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import ExperienceModal from './ExperienceModal';
import axios from '../../services/axios';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
interface ExperienceTabProps {
  experiencias: Experiencia[];
}

interface Area {
  id: number;
  nombre_area: string;
}

interface Experiencia {
  empresa: string;
  puesto: string;
  area:Area;
  fechaini: string;
  fechafin: string;
  descripcion: string;
  referencia: string;
  contacto: string;
}


const ExperienceTab: React.FC<ExperienceTabProps> = ({ experiencias }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const {  reset } = useForm<Experiencia>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperiencia, setSelectedExperiencia] = useState<Experiencia | null>(null);

  const openModal = () => {
    setSelectedExperiencia(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddExperiencia = async (data: Experiencia) => {
    if (user) {
    try {
      const dataToSend = {
        ...data,
        id_usuario:`${user.id}`, // Añades el id_usuario al objeto data
      };
    
      const response = await axios.post('exp', dataToSend);
      console.log('Experiencia agregada:', response.data);  // Manejar la respuesta del servidor
      
      reset();
     
    } catch (error: any) {
      console.error('Error enviando los datos:', error);
      
    }
  }
    
    closeModal();
  };

  return (
    <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Experiencia</h3>
        <button onClick={openModal} className="text-orange-400 hover:underline">
          + Agregar experiencia
        </button>
      </div>
      {experiencias && experiencias.length > 0 ? (
        experiencias.map((experiencia, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-700 relative">
            <div className="flex justify-end space-x-2 mb-2">
              <button
                onClick={() => openModal()}
                className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <FaPencilAlt className="w-4 h-4" />
              </button>
              <button
                className="px-2 py-1 bg-rose-500 text-white rounded-md hover:bg-rose-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
            <p><strong>Empresa:</strong> {experiencia.empresa}</p>
            <p><strong>Puesto:</strong> {experiencia.puesto}</p>
            <p><strong>Area:</strong> {experiencia.area.nombre_area}</p>
            <p><strong>Fecha de Inicio:</strong> {experiencia.fechaini}</p>
            <p><strong>Fecha de Fin:</strong> {experiencia.fechafin}</p>
            <p><strong>Descripción:</strong> {experiencia.descripcion}</p>
            <p><strong>Referencia:</strong> {experiencia.referencia}</p>
            <p><strong>Contacto:</strong> {experiencia.contacto}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No hay experiencia disponible en este momento.</p>
      )}
      <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={openModal}>
        <span className="text-gray-400">Agrega tu experiencia</span>
      </div>

      <ExperienceModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onSubmit={handleAddExperiencia}
      />
    </div>
  );
};

export default ExperienceTab;
