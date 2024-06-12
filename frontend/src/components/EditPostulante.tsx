// EditPostulanteModal.tsx
import React from 'react';
import Modal from 'react-modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from '../services/axios';

interface IFormInput {
  nombres: string;
  apellidos: string;
  fecha_nac: string;
  estado_civil: string;
  cedula: string;
  genero: string;
  informacion_extra: string;
}

interface EditPostulanteModalProps {
  isOpen: boolean;
  closeModal: () => void;
  postulante: any;
}

const EditPostulanteModal: React.FC<EditPostulanteModalProps> = ({ isOpen, closeModal, postulante }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await axios.put(`postulante/${postulante.id}`, data);
      closeModal();
    } catch (error) {
      console.error('Error updating postulante:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Editar Postulante"
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto my-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
        &times;
      </button>
      <h2 className="text-2xl text-center font-semibold mb-4 text-blue-500">Editar Postulante</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-auto max-h-96">
        <div className="form-group">
          <label htmlFor="nombres" className="block text-gray-700">Nombres:</label>
          <input type="text" id="nombres" defaultValue={postulante.nombres} {...register('nombres', { required: true })} className="w-full px-4 py-2 border rounded-md" />
          {errors.nombres && <span className="text-red-500">Este campo es obligatorio</span>}
        </div>
        <div className="form-group">
          <label htmlFor="apellidos" className="block text-gray-700">Apellidos:</label>
          <input type="text" id="apellidos" defaultValue={postulante.apellidos} {...register('apellidos', { required: true })} className="w-full px-4 py-2 border rounded-md" />
          {errors.apellidos && <span className="text-red-500">Este campo es obligatorio</span>}
        </div>
        <div className="form-group">
          <label htmlFor="fecha_nac" className="block text-gray-700">Fecha de Nacimiento:</label>
          <input type="date" id="fecha_nac" defaultValue={postulante.fecha_nac} {...register('fecha_nac', { required: true })} className="w-full px-4 py-2 border rounded-md" />
          {errors.fecha_nac && <span className="text-red-500">Este campo es obligatorio</span>}
        </div>
        <div className="form-group">
          <label htmlFor="estado_civil" className="block text-gray-700">Estado Civil:</label>
          <input type="text" id="estado_civil" defaultValue={postulante.estado_civil} {...register('estado_civil', { required: true })} className="w-full px-4 py-2 border rounded-md" />
          {errors.estado_civil && <span className="text-red-500">Este campo es obligatorio</span>}
        </div>
        <div className="form-group">
          <label htmlFor="cedula" className="block text-gray-700">Cédula:</label>
          <input type="text" id="cedula" defaultValue={postulante.cedula} {...register('cedula', { required: true })} className="w-full px-4 py-2 border rounded-md" />
          {errors.cedula && <span className="text-red-500">Este campo es obligatorio</span>}
        </div>
        <div className="form-group">
          <label htmlFor="genero" className="block text-gray-700">Género:</label>
          <input type="text" id="genero" defaultValue={postulante.genero} {...register('genero', { required: true })} className="w-full px-4 py-2 border rounded-md" />
          {errors.genero && <span className="text-red-500">Este campo es obligatorio</span>}
        </div>
        <div className="form-group">
          <label htmlFor="informacion_extra" className="block text-gray-700">Información Extra:</label>
          <textarea id="informacion_extra" defaultValue={postulante.informacion_extra} {...register('informacion_extra')} className="w-full px-4 py-2 border rounded-md" />
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={closeModal} className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPostulanteModal;
