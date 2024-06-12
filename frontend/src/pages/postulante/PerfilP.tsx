import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from "../../services/axios";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

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

const CompletarP2: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
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

        for (const entry of formData.entries()) {
          console.log(entry);
        }
        await axios.post('postulante/forma', formData);
        console.log("Exito");
        closeModal();
        navigate("/inicio");
      } catch (error) {
        console.error('Error fetching ubicacion ID:', error);
      }
    }
  };

  return (
    <div className="p-0 bg-gray-100">
  <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
    <div className="form-group mb-4">
      <label htmlFor="nivelEducacion" className="block text-blue-700 font-semibold mb-2">Nivel de Educación:</label>
      <select id="nivelEducacion" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" onChange={handleNivelChange}>
        <option value="">Seleccione</option>
        {niveles.map((nivel, index) => (
          <option key={index} value={nivel}>
            {nivel}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group mb-4">
      <label htmlFor="campoAmplio" className="block text-blue-700 font-semibold mb-2">Campo Amplio:</label>
      <select id="campoAmplio" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" onChange={handleCampoChange} disabled={!selectedNivel}>
        <option value="">Seleccione</option>
        {campos.map((campo, index) => (
          <option key={index} value={campo}>
            {campo}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group mb-4">
      <label htmlFor="titulo" className="block text-blue-700 font-semibold mb-2">Título:</label>
      <select id="titulo" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" onChange={handleTituloChange} disabled={!selectedNivel || !selectedCampo}>
        <option value="">Seleccione</option>
        {titulos.map((titulo, index) => (
          <option key={index} value={titulo.id}>
            {titulo.titulo}
          </option>
        ))}
      </select>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="form-group">
        <label htmlFor="institucion" className="block text-blue-700 font-semibold mb-2">Institución:</label>
        <input type="text" id="institucion" {...register('institucion')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
      </div>
      <div className="form-group">
        <label htmlFor="estado" className="block text-blue-700 font-semibold mb-2">Estado:</label>
        <select id="estado" {...register('estado')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="">Seleccione</option>
          <option value="En curso">En curso</option>
          <option value="Culminado">Culminado</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="form-group">
        <label htmlFor="fechaini" className="block text-blue-700 font-semibold mb-2">Fecha de inicio:</label>
        <input type="date" id="fechaini" {...register('fechaini')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
      </div>
      <div className="form-group">
        <label htmlFor="fechafin" className="block text-blue-700 font-semibold mb-2">Fecha de Fin:</label>
        <input type="date" id="fechafin" {...register('fechafin')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
      </div>
    </div>

    <div className="flex justify-between">
      <button type="button" onClick={closeModal} className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white">Cancelar</button>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Guardar</button>
    </div>
  </form>
</div>

  );
}

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if(user){
          const response = await axios.get(`/perfil/${user.id}`);
          setProfileData(response.data);
        }
      
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const openModal = (content: string) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!profileData) {
    return <div className="flex justify-center items-center h-screen">No profile data found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-[#111827] rounded-lg shadow-md text-white">
      <div className="flex items-center space-x-4">
        <img
          src={`http://localhost:8000/storage/${profileData.postulante.foto}`}
          alt={`${profileData.postulante.nombres} ${profileData.postulante.apellidos}`}
          className="w-24 h-24 rounded-full object-cover border-4 border-white"
        />
        <div>
          <h1 className="text-3xl font-semibold">
            {profileData.postulante.nombres} {profileData.postulante.apellidos}
          </h1>
          <p className="text-gray-400">{profileData.ubicacion.provincia}, {profileData.ubicacion.canton}</p>
        </div>
      </div>
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
        <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Detalles del Perfil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>Fecha de Nacimiento:</strong> {profileData.postulante.fecha_nac}</p>
          <p><strong>Edad:</strong> {profileData.postulante.edad}</p>
          <p><strong>Estado Civil:</strong> {profileData.postulante.estado_civil}</p>
          <p><strong>Cédula:</strong> {profileData.postulante.cedula}</p>
          <p><strong>Género:</strong> {profileData.postulante.genero}</p>
          <p><strong>Información Extra:</strong> {profileData.postulante.informacion_extra}</p>
        </div>
      </div>
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
        <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Formación Académica</h2>
        {profileData.formaciones.map((formacion, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-700">
            <p><strong>Institución:</strong> {formacion.institucion}</p>
            <p><strong>Estado:</strong> {formacion.estado}</p>
            <p><strong>Fecha de Inicio:</strong> {formacion.fechaini}</p>
            <p><strong>Fecha de Fin:</strong> {formacion.fechafin}</p>
            <p><strong>Título:</strong> {formacion.titulo.titulo}</p>
            <p><strong>Nivel de Educación:</strong> {formacion.titulo.nivel_educacion}</p>
            <p><strong>Campo Amplio:</strong> {formacion.titulo.campo_amplio}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-4">Formación académica</h3>
          <button
            onClick={() => openModal('formacion')}
            className="text-orange-400 hover:underline"
          >
            + Agregar educación
          </button>
        </div>
        <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('formacion')}>
          <span className="text-gray-400">Agrega formación académica</span>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-4">Cursos y Capacitaciones</h3>
          <button
            onClick={() => openModal('cursos')}
            className="text-orange-400 hover:underline"
          >
            + Agregar curso
          </button>
        </div>
        <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('cursos')}>
          <span className="text-gray-400">Agrega tus cursos y capacitaciones</span>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-4">Experiencia Laboral</h3>
          <button
            onClick={() => openModal('experiencia')}
            className="text-orange-400 hover:underline"
          >
            + Agregar experiencia
          </button>
        </div>
        <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('experiencia')}>
          <span className="text-gray-400">Agrega tu experiencia laboral</span>
        </div>
      </div>
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold mb-4">Idiomas</h3>
        <button
          onClick={() => openModal('idioma')}
          className="text-orange-400 hover:underline"
        >
          + Agregar idioma
        </button>
      </div>
        <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('idioma')}>
          <span className="text-gray-400">Agrega tu idioma</span>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar Información"
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto my-20 relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
          &times;
        </button>
        <h2 className="text-2xl text-center font-semibold mb-4 text-blue-500">Agregar {modalContent}</h2>
        {modalContent === 'formacion' && <CompletarP2 closeModal={closeModal} />}
      
        {modalContent === 'cursos' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre del Curso</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Subir Archivo del Curso</label>
              <input type="file" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white">Cancelar</button>
              <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">Guardar</button>
            </div>
          </>
        )}

        {modalContent === 'experiencia' && (
          <form className="space-y-4 overflow-auto max-h-96 p-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700">Empresa</label>
                <input type="text" className="w-full px-4 py-2 border rounded-md" placeholder="Ingresa el nombre" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Puesto</label>
                <input type="text" className="w-full px-4 py-2 border rounded-md" placeholder="Ingresa el nombre" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700">Fecha de inicio</label>
                <div className="grid grid-cols-2 gap-2">
                  <select className="w-full px-4 py-2 border rounded-md">
                    <option value="">Mes</option>
                    {/* Aquí puedes mapear las opciones de mes */}
                  </select>
                  <select className="w-full px-4 py-2 border rounded-md">
                    <option value="">Año</option>
                    {/* Aquí puedes mapear las opciones de año */}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fecha de finalización</label>
                <div className="grid grid-cols-2 gap-2">
                  <select className="w-full px-4 py-2 border rounded-md">
                    <option value="">Mes</option>
                    {/* Aquí puedes mapear las opciones de mes */}
                  </select>
                  <select className="w-full px-4 py-2 border rounded-md">
                    <option value="">Año</option>
                    {/* Aquí puedes mapear las opciones de año */}
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Descripción de responsabilidades</label>
              <textarea className="w-full px-4 py-2 border rounded-md" rows={3} placeholder="Escribe cuáles son tus tareas"></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Persona de referencia</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md" placeholder="Nombre de la persona de referencia" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contacto de referencia</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md" placeholder="Correo electrónico o teléfono" />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">Guardar</button>
            </div>
          </form>
        )}

        {modalContent === 'idioma' && (
          <form className="space-y-4 p-4">
            <h2 className="text-blue-600 text-xl font-semibold">Sumar idioma</h2>
            <p className="text-right text-gray-500 text-sm">*Campos obligatorios</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700">Idioma <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 border rounded-md" required>
                  <option value="">Elige una opción</option>
                  {/* Aquí puedes mapear las opciones de idioma */}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nivel escrito <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 border rounded-md" required>
                  <option value="">Elige una opción</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Nativo">Nativo</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nivel oral <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 border rounded-md" required>
                  <option value="">Elige una opción</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Nativo">Nativo</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">Guardar</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Profile;
