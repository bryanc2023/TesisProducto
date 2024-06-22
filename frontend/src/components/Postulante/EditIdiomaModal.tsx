import React from 'react';
import Modal from 'react-modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from '../../services/axios';

interface EditIdiomaModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  idioma: Idioma;
  onIdiomaUpdated: () => void;
}

interface FormValues {
  nivel_oral: string;
  nivel_escrito: string;
}

const EditIdiomaModal: React.FC<EditIdiomaModalProps> = ({ isOpen, onRequestClose, idioma, onIdiomaUpdated }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      nivel_oral: idioma.nivel_oral,
      nivel_escrito: idioma.nivel_escrito,
    }
  });

  React.useEffect(() => {
    reset({
      nivel_oral: idioma.nivel_oral,
      nivel_escrito: idioma.nivel_escrito,
    });
  }, [idioma, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await axios.put(`/updateIdioma/${idioma.idioma?.id}`, data);
      onIdiomaUpdated();
      onRequestClose();
    } catch (error) {
      console.error('Error updating idioma:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Editar Idioma"
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto my-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Editar Idioma</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Nivel Oral <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-2 border rounded-md" required
              {...register('nivel_oral', { required: 'Este campo es requerido' })}>
              <option value="">Seleccionar nivel</option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Nativo">Nativo</option>
            </select>
            {errors.nivel_oral && <span className="text-red-500">{errors.nivel_oral.message}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Nivel Escrito <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-2 border rounded-md" required
              {...register('nivel_escrito', { required: 'Este campo es requerido' })}>
              <option value="">Seleccionar nivel</option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Nativo">Nativo</option>
            </select>
            {errors.nivel_escrito && <span className="text-red-500">{errors.nivel_escrito.message}</span>}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Actualizar</button>
          <button type="button" onClick={onRequestClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200">Cancelar</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditIdiomaModal;
