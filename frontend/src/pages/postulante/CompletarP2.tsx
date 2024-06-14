import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from "../../services/axios";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

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

function CompletarP2() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors }, watch, setValue, clearErrors } = useForm<IFormInput>();
  const [niveles, setNiveles] = useState<string[]>([]);
  const [campos, setCampos] = useState<string[]>([]);
  const [titulos, setTitulos] = useState<Titulo[]>([]);
  const [selectedNivel, setSelectedNivel] = useState('');
  const [selectedCampo, setSelectedCampo] = useState('');
  const [selectedTitulo, setSelectedTitulo] = useState('');
  const [selectedTituloId, setSelectedTituloId] = useState<string>('');

  const watchFechaini = watch('fechaini');
  const watchFechafin = watch('fechafin');
  
  useEffect(() => {
    // Obtener titulo nivel y campo
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
    // Obtener campos cuando se selecciona un nivel
    const fetchCampos = async () => {
      if (selectedNivel) {
        try {
          const response = await axios.get(`titulos/${selectedNivel}`);
          setCampos(response.data);
        } catch (error) {
          console.error('Error fetching campos:', error);
        }
      }
    };

    fetchCampos();
  }, [selectedNivel]);

  useEffect(() => {
    // Obtener titulos por anteriores
    const fetchTitulos = async () => {
      if (selectedNivel && selectedCampo) {
        try {
          const response = await axios.get(`titulos/${selectedNivel}/${selectedCampo}`);
          setTitulos(response.data);
        } catch (error) {
          console.error('Error fetching titulos:', error);
        }
      }
    };

    fetchTitulos();
  }, [selectedNivel, selectedCampo]);

  const handleNivelChange = (event: any) => {
    setSelectedNivel(event.target.value);
    setSelectedTitulo(''); 
    setSelectedTituloId('');
    setCampos([]); // Clear campos when nivel changes
    setTitulos([]); // Clear titulos when nivel changes
    setValue('estado', '');
    clearErrors('estado');
  };

  const handleCampoChange = (event: any) => {
    setSelectedCampo(event.target.value);
    setSelectedTitulo(''); 
    setSelectedTituloId('');
    setTitulos([]); // Clear titulos when campo changes
    setValue('estado', '');
    clearErrors('estado');
  };

  const handleTituloChange = (event: any) => {
    const selectedTituloValue = event.target.value;
    setSelectedTitulo(selectedTituloValue);

    // Buscar el ID del título seleccionado en la lista de títulos
    const selectedTituloObject = titulos.find(titulo => titulo.id.toString() === selectedTituloValue);
    if (selectedTituloObject) {
      setSelectedTituloId(selectedTituloObject.id.toString());
    } else {
      setSelectedTituloId('');
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    
    if (new Date(data.fechaini) > new Date(data.fechafin)) {
      alert('La fecha de inicio no puede ser mayor a la fecha de fin');
      return;
    }

    if (new Date(data.fechaini) > new Date(today) || new Date(data.fechafin) > new Date(today)) {
      alert('Las fechas no pueden ser mayores que el día de hoy');
      return;
    }

    if (user && selectedNivel && selectedCampo && selectedTitulo) {
      try {
        const response2 = await axios.get('postulanteId/id', {
          params: {
            id_usuario: user.id // Aquí debes proporcionar el ID de usuario correcto
          }
        });
        const postulanteId = response2.data.id_postulante;

        // Ahora puedes enviar el ID de la ubicación junto con otros datos del formulario
        const formData = new FormData();
        formData.append('id_postulante', postulanteId.toString());
        formData.append('id_titulo', selectedTituloId);
        formData.append('institucion', data.institucion);
        formData.append('estado', data.estado);
        formData.append('fechaini', data.fechaini);
        formData.append('fechafin', data.fechafin);

        for (const entry of formData.entries()) {
          console.log(entry);
        }
        await axios.post('postulante/forma', formData);
        console.log("Exito");
        navigate("/inicio");
      } catch (error) {
        console.error('Error fetching ubicacion ID:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-5 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">Completar registro</h1>
      <p className="text-center mb-8">Formación Académica:</p>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">

        <div className="form-group mb-8">
          <label htmlFor="nivelEducacion" className="block text-gray-700 font-semibold mb-2">Nivel de Educación:</label>
          <select id="nivelEducacion" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
            onChange={handleNivelChange}>
            <option value="">Seleccione</option>
            {niveles.map((nivel, index) => (
              <option key={index} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-8">
          <label htmlFor="campoAmplio" className="block text-gray-700 font-semibold mb-2">Campo Amplio:</label>
          <select id="campoAmplio" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
            onChange={handleCampoChange}
            disabled={!selectedNivel}>
            <option value="">Seleccione</option>
            {campos.map((campo, index) => (
              <option key={index} value={campo}>
                {campo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-8">
          <label htmlFor="titulo" className="block text-gray-700 font-semibold mb-2">Título:</label>
          <select id="titulo" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
            onChange={handleTituloChange}
            disabled={!selectedNivel || !selectedCampo}>
            <option value="">Seleccione</option>
            {titulos.map((titulo, index) => (
              <option key={index} value={titulo.id}>
                {titulo.titulo}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="form-group">
            <label htmlFor="institucion" className="block text-gray-700 font-semibold mb-2">Institución:</label>
            <input type="text" id="institucion" {...register('institucion', { required: 'Este campo es requerido' })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
            {errors.institucion && <p className="text-red-500 text-sm mt-2">{errors.institucion.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="estado" className="block text-gray-700 font-semibold mb-2">Estado:</label>
            <select id="estado" {...register('estado', { required: 'Este campo es requerido' })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600">
              <option value="">Seleccione</option>
              <option value="En curso">En curso</option>
              <option value="Culminado">Culminado</option>
            </select>
            {errors.estado && <p className="text-red-500 text-sm mt-2">{errors.estado.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="form-group">
            <label htmlFor="fechaini" className="block text-gray-700 font-semibold mb-2">Fecha de inicio:</label>
            <input type="date" id="fechaini" {...register('fechaini', { required: 'Este campo es requerido', validate: value => {
              const today = new Date().toISOString().split('T')[0];
              return value <= today || 'La fecha no puede ser mayor a hoy';
            } })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
            {errors.fechaini && <p className="text-red-500 text-sm mt-2">{errors.fechaini.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="fechafin" className="block text-gray-700 font-semibold mb-2">Fecha de Fin:</label>
            <input type="date" id="fechafin" {...register('fechafin', { required: 'Este campo es requerido', validate: value => {
              const today = new Date().toISOString().split('T')[0];
              return value <= today || 'La fecha no puede ser mayor a hoy';
            } })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
            {errors.fechafin && <p className="text-red-500 text-sm mt-2">{errors.fechafin.message}</p>}
          </div>
        </div>

        <button type="submit" className="w-full py-3 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-slate-600">Añadir</button>
      </form>
    </div>
  );
}

export default CompletarP2;
