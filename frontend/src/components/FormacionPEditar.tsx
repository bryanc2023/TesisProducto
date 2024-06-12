import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from '../services/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface IFormInput {
  institucion: string;
  estado: string;
  fechaini: string;
  fechafin: string;
}

interface Titulo {
  id: number;
  titulo: string;
}

interface EditFormacionModalProps {
  isOpen: boolean;
  closeModal: () => void;
  formacion?: any;
  reloadProfile: () => void;
}

const EditFormacionModal: React.FC<EditFormacionModalProps> = ({ isOpen, closeModal, formacion, reloadProfile }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<IFormInput>();
  const [niveles, setNiveles] = useState([]);
  const [campos, setCampos] = useState([]);
  const [titulos, setTitulos] = useState<Titulo[]>([]);
  const [selectedNivel, setSelectedNivel] = useState('');
  const [selectedCampo, setSelectedCampo] = useState('');
  const [selectedTitulo, setSelectedTitulo] = useState('');
  const [selectedTituloId, setSelectedTituloId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('titulos');
        setNiveles(response.data.nivel);
        setCampos(response.data.campo);
        setTitulos(response.data.titulo);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formacion) {
      setValue('institucion', formacion.institucion);
      setValue('estado', formacion.estado);
      setValue('fechaini', formacion.fechaini);
      setValue('fechafin', formacion.fechafin);
      setSelectedNivel(formacion.titulo.nivel_educacion);
      setSelectedCampo(formacion.titulo.campo_amplio);
      setSelectedTitulo(formacion.titulo.id.toString());
      setSelectedTituloId(formacion.titulo.id.toString());
    } else {
      reset({
        institucion: '',
        estado: '',
        fechaini: '',
        fechafin: '',
      });
      setSelectedNivel('');
      setSelectedCampo('');
      setSelectedTitulo('');
      setSelectedTituloId('');
    }
  }, [formacion, setValue, reset]);

  useEffect(() => {
    if (selectedNivel) {
      const fetchCampos = async () => {
        try {
          const response = await axios.get(`titulos/${selectedNivel}`);
          setCampos(response.data);
        } catch (error) {
          console.error('Error fetching campos:', error);
        }
      };

      fetchCampos();
    }
  }, [selectedNivel]);

  useEffect(() => {
    if (selectedNivel && selectedCampo) {
      const fetchTitulos = async () => {
        try {
          const response = await axios.get(`titulos/${selectedNivel}/${selectedCampo}`);
          setTitulos(response.data);
        } catch (error) {
          console.error('Error fetching titulos:', error);
        }
      };

      fetchTitulos();
    }
  }, [selectedNivel, selectedCampo]);

  const handleNivelChange = (event: any) => {
    setSelectedNivel(event.target.value);
    setSelectedTitulo('');
    setSelectedTituloId('');
  };

  const handleCampoChange = (event: any) => {
    setSelectedCampo(event.target.value);
    setSelectedTitulo('');
    setSelectedTituloId('');
  };

  const handleTituloChange = (event: any) => {
    const selectedTituloValue = event.target.value;
    setSelectedTitulo(selectedTituloValue);

    const selectedTituloObject = titulos.find(titulo => titulo.id.toString() === selectedTituloValue);
    if (selectedTituloObject) {
      setSelectedTituloId(selectedTituloObject.id.toString());
    } else {
      setSelectedTituloId('');
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (user && selectedNivel && selectedCampo && selectedTitulo) {
      try {
        const formData = {
          id_postulante: formacion ? formacion.id_postulante : user.id,
          id_titulo: selectedTituloId,
          institucion: data.institucion,
          estado: data.estado,
          fechaini: data.fechaini,
          fechafin: data.fechafin,
        };

        if (formacion) {
          await axios.put(`formacion/${formacion.id}`, formData);
        } else {
          await axios.post('postulante/forma', formData);
        }
        closeModal();
        reloadProfile();
      } catch (error) {
        console.error('Error saving formacion:', error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Editar Formación Académica"
      className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl mx-auto my-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
        &times;
      </button>
      <h2 className="text-2xl text-center font-semibold mb-4 text-blue-500">{formacion ? 'Editar' : 'Agregar'} Formación Académica</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-auto max-h-96">
        <div className="form-group">
          <label htmlFor="nivelEducacion" className="block text-gray-700 font-semibold mb-2">Nivel de Educación:</label>
          <select id="nivelEducacion" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" onChange={handleNivelChange} value={selectedNivel}>
            <option value="">Seleccione</option>
            {niveles.map((nivel, index) => (
              <option key={index} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="campoAmplio" className="block text-gray-700 font-semibold mb-2">Campo Amplio:</label>
          <select id="campoAmplio" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" onChange={handleCampoChange} value={selectedCampo} disabled={!selectedNivel}>
            <option value="">Seleccione</option>
            {campos.map((campo, index) => (
              <option key={index} value={campo}>
                {campo}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="titulo" className="block text-gray-700 font-semibold mb-2">Título:</label>
          <select id="titulo" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" onChange={handleTituloChange} value={selectedTitulo} disabled={!selectedNivel || !selectedCampo}>
            <option value="">Seleccione</option>
            {titulos.map((titulo, index) => (
              <option key={index} value={titulo.id}>
                {titulo.titulo}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="institucion" className="block text-gray-700 font-semibold mb-2">Institución:</label>
          <input type="text" id="institucion" {...register('institucion', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
          {errors.institucion && <span className="text-red-500">Este campo es obligatorio</span>}
        </div>
        <div className="form-group">
          <label htmlFor="estado" className="block text-gray-700 font-semibold mb-2">Estado:</label>
          <select id="estado" {...register('estado', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option value="">Seleccione</option>
            <option value="En curso">En curso</option>
            <option value="Culminado">Culminado</option>
          </select>
          {errors.estado && <span className="text-red-500">Este campo es obligatorio</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="fechaini" className="block text-gray-700 font-semibold mb-2">Fecha de Inicio:</label>
            <input type="date" id="fechaini" {...register('fechaini', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
            {errors.fechaini && <span className="text-red-500">Este campo es obligatorio</span>}
          </div>
          <div className="form-group">
            <label htmlFor="fechafin" className="block text-gray-700 font-semibold mb-2">Fecha de Fin:</label>
            <input type="date" id="fechafin" {...register('fechafin', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
            {errors.fechafin && <span className="text-red-500">Este campo es obligatorio</span>}
          </div>
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={closeModal} className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">{formacion ? 'Guardar' : 'Añadir'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditFormacionModal;