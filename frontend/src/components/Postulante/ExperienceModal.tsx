import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ExperienceModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: SubmitHandler<Experiencia>;
}

interface Experiencia {
  empresa: string;
  puesto: string;
  fechaini: string;
  fechafin: string;
  descripcion: string;
  referencia: string;
  contacto: string;
  numero: string;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Experiencia>();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-4 md:mx-auto my-20 relative">
        <button onClick={onRequestClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">Agregar Experiencia</h2>
        <div className="max-h-96 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700">Empresa</label>
              <input {...register('empresa', { required: 'Este campo es obligatorio' })} className="w-full px-4 py-2 border rounded-md" />
              {errors.empresa && <p className="text-red-500">{errors.empresa.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Puesto</label>
              <input {...register('puesto', { required: 'Este campo es obligatorio' })} className="w-full px-4 py-2 border rounded-md" />
              {errors.puesto && <p className="text-red-500">{errors.puesto.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Fecha de Inicio</label>
              <input type="date" {...register('fechaini', { required: 'Este campo es obligatorio' })} className="w-full px-4 py-2 border rounded-md" />
              {errors.fechaini && <p className="text-red-500">{errors.fechaini.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Fecha de Fin</label>
              <input type="date" {...register('fechafin', { required: 'Este campo es obligatorio' })} className="w-full px-4 py-2 border rounded-md" />
              {errors.fechafin && <p className="text-red-500">{errors.fechafin.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Descripción</label>
              <textarea {...register('descripcion', { required: 'Este campo es obligatorio' })} className="w-full px-4 py-2 border rounded-md" />
              {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Referencia</label>
              <input {...register('referencia', { required: 'Este campo es obligatorio' })} className="w-full px-4 py-2 border rounded-md" />
              {errors.referencia && <p className="text-red-500">{errors.referencia.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Contacto</label>
              <input type="email" {...register('contacto', { required: 'Este campo es obligatorio' })} className="w-full px-4 py-2 border rounded-md" />
              {errors.contacto && <p className="text-red-500">{errors.contacto.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Número</label>
              <input type="text" {...register('numero', { required: 'Este campo es obligatorio' })} className="w-full px-4 py-2 border rounded-md" />
              {errors.numero && <p className="text-red-500">{errors.numero.message}</p>}
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={onRequestClose} className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExperienceModal;