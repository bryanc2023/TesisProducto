import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from "../../services/axios";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface IFormInput {
  institucion: string;
  estado: string;
  fechaini: string;
  fechafin: string;
  titulo_acreditado:string;
  id_idioma: number;
  niveloral: string;
  nivelescrito: string;

}

interface Titulo {
  id: number;
  titulo: string;
}

interface Idioma {
  id: number;
  nombre: string;
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
  const [isEnCurso, setIsEnCurso] = useState(false);
  const [languages, setLanguages] = useState<Idioma[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('titulos');
        const response2 = await axios.get('idioma');
        setNiveles(response.data.nivel);
        setCampos(response.data.campo);
        setTitulos(response.data.titulo);
        setLanguages(response2.data.idiomas);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
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
    setCampos([]);
    setTitulos([]);
    setValue('estado', '');
    clearErrors('estado');
  };

  const handleCampoChange = (event: any) => {
    setSelectedCampo(event.target.value);
    setSelectedTitulo('');
    setSelectedTituloId('');
    setTitulos([]);
    setValue('estado', '');
    clearErrors('estado');
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

  const handleEstadoChange = (e: any) => {
    const selectedEstado = e.target.value;
    if (selectedEstado === 'En curso') {
      setIsEnCurso(true);
    } else {
      setIsEnCurso(false);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const today = new Date().toISOString().split('T')[0];
    
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
            id_usuario: user.id
          }
        });
        const postulanteId = response2.data.id_postulante;

       

        const formData = new FormData();
        formData.append('id_postulante', postulanteId.toString());
        formData.append('id_titulo', selectedTituloId);
        formData.append('institucion', data.institucion);
        formData.append('estado', data.estado);
        formData.append('fechaini', data.fechaini);
        formData.append('fechafin', data.fechafin);
        formData.append('id_idioma', data.id_idioma.toString());
        formData.append('niveloral', data.niveloral);
        formData.append('nivelescrito', data.nivelescrito);
        formData.append('titulo_acreditado', data.titulo_acreditado);
        

        await axios.post('postulante/forma', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("Exito");
        
        Swal.fire({
          icon: 'success',
          title: '¡Registro completo!',
          text: 'Bienvenido a proajob',
        }).then(() => {
          navigate("/perfilP");
          Swal.fire({
            icon: 'success',
            title: '¡Para tener mejores oportunidades!',
            text: 'Completa tu registro añadiendo experiencias , cursos, idiomas , certificaciones..',
          })
        });
      } catch (error) {
        console.error('Error uploading CV or submitting form:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-5 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">Completar registro</h1>
      <p className="text-center mb-8">Necesitamos más información acerca de tu trayectoria, tranquilo podras aumentar más experiencia, títulos e idiomas en tu perfil.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl text-center font-semibold mb-4 text-blue-500">Formación Académica</h2>
        <p className="text-center mb-8">Añade mínimo un título para comenzar:</p>
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
        <div className="form-group">
          <label htmlFor="titulo_acreditado" className="block text-gray-700 font-semibold mb-2">Título Acreditado:</label>
          <input type="text" id="titulo_acreditado" {...register('titulo_acreditado', { required: true })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
          {errors.titulo_acreditado && <span className="text-red-500">Este campo es obligatorio</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="form-group">
            <label htmlFor="institucion" className="block text-gray-700 font-semibold mb-2">Institución:</label>
            <input type="text" id="institucion" {...register('institucion', { required: 'Este campo es requerido' })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
            {errors.institucion && <p className="text-red-500 text-sm mt-2">{errors.institucion.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="estado" className="block text-gray-700 font-semibold mb-2">Estado:</label>
            <select id="estado" {...register('estado', { required: 'Este campo es requerido' })} onChange={handleEstadoChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600">
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

          {!isEnCurso && (
            <div className="form-group">
              <label htmlFor="fechafin" className="block text-gray-700 font-semibold mb-2">Fecha de Fin:</label>
              <input type="date" id="fechafin" {...register('fechafin', { required: 'Este campo es requerido', validate: value => {
                const today = new Date().toISOString().split('T')[0];
                return value <= today || 'La fecha no puede ser mayor a hoy';
              } })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
              {errors.fechafin && <p className="text-red-500 text-sm mt-2">{errors.fechafin.message}</p>}
            </div>
          )}
        </div>

        <h2 className="text-2xl text-center font-semibold mb-4 text-blue-500">Información básica:</h2>
        <p className="text-center mb-8">Añade mínimo un idioma para comenzar:</p>
        <p className="text-right text-gray-500 text-sm">*Campos obligatorios</p>
        <div className="grid grid-cols-1 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Idioma <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-2 border rounded-md" required
              {...register('id_idioma', { required: 'Este campo es requerido' })}>
              <option value="">Elige una opción</option>
              {languages.map((language: Idioma) => (
                <option key={language.id} value={language.id}>
                  {language.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Nivel escrito <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-2 border rounded-md" required
              {...register('nivelescrito', { required: 'Este campo es requerido' })}>
              <option value="">Elige una opción</option>
              <option value="Basico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Nativo">Nativo</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nivel oral <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-2 border rounded-md" required
              {...register('niveloral', { required: 'Este campo es requerido' })}>
              <option value="">Elige una opción</option>
              <option value="Basico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Nativo">Nativo</option>
            </select>
          </div>
        </div>
        

        <button type="submit" className="w-full py-3 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-slate-600">Culminar registro</button>
      </form>
    </div>
  );
}

export default CompletarP2;
