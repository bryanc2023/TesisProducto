import React from 'react';
import Modal from 'react-modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from '../../services/axios';

interface AddIdiomaModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onIdiomaAdded: () => void;
  languages: { id: number; nombre: string }[];
  userId: number; // Añade esta propiedad
}

interface FormValues {
  idiomaId: number;
  nivelOral: string;
  nivelEscrito: string;
}

const AddIdiomaModal: React.FC<AddIdiomaModalProps> = ({ isOpen, onRequestClose, onIdiomaAdded, languages, userId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await axios.post('nuevoidioma', {
        userId, // Usa el userId pasado como propiedad
        idiomaId: data.idiomaId,
        nivel_oral: data.nivelOral,
        nivel_escrito: data.nivelEscrito,
      });
      onIdiomaAdded();
      onRequestClose();
    } catch (error) {
      console.error('Error adding idioma:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Agregar Idioma"
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto my-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Agregar Idioma</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Idioma <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-2 border rounded-md" {...register('idiomaId', { required: 'Este campo es requerido' })}>
              <option value="">Seleccionar idioma</option>
              {languages.map((language) => (
                <option key={language.id} value={language.id}>{language.nombre}</option>
              ))}
            </select>
            {errors.idiomaId && <span className="text-red-500">{errors.idiomaId.message}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Nivel Oral <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-2 border rounded-md" {...register('nivelOral', { required: 'Este campo es requerido' })}>
              <option value="">Seleccionar nivel</option>
              <option value="Basico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Nativo">Nativo</option>
            </select>
            {errors.nivelOral && <span className="text-red-500">{errors.nivelOral.message}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Nivel Escrito <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-2 border rounded-md" {...register('nivelEscrito', { required: 'Este campo es requerido' })}>
              <option value="">Seleccionar nivel</option>
              <option value="Basico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Nativo">Nativo</option>
            </select>
            {errors.nivelEscrito && <span className="text-red-500">{errors.nivelEscrito.message}</span>}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Agregar</button>
          <button type="button" onClick={onRequestClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200">Cancelar</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddIdiomaModal;
