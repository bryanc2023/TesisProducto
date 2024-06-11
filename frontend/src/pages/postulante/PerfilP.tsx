import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Modal from 'react-modal';

interface ProfileData {
  postulante: {
    id_postulante: number;
    nombres: string;
    apellidos: string;
    fecha_nac: string;
    edad: number;
    estado_civil: string;
    cedula: string;
    genero: string;
    informacion_extra: string;
    foto: string;
  };
  ubicacion: {
    provincia: string;
    canton: string;
  };
  formaciones: {
    institucion: string;
    estado: string;
    fechaini: string;
    fechafin: string;
    titulo: {
      titulo: string;
      nivel_educacion: string;
      campo_amplio: string;
    };
  }[];
}

Modal.setAppElement('#root');

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [experiencias, setExperiencias] = useState([]);
  const [educaciones, setEducaciones] = useState([]);
  const [habilidades, setHabilidades] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`/perfil/${user.id}`);
        setProfileData(response.data);
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

  const handleAdd = () => {
    if (modalContent === 'experiencia') {
      setExperiencias([...experiencias, { titulo: '', empresa: '', descripcion: '' }]);
    } else if (modalContent === 'educacion') {
      setEducaciones([...educaciones, { titulo: '', institucion: '', ano: '' }]);
    } else if (modalContent === 'habilidades') {
      setHabilidades([...habilidades, { habilidad: '', nivel: '' }]);
    }
    closeModal();
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
          <h3 className="text-xl font-semibold mb-4">Experiencia Laboral</h3>
          <button
            onClick={() => openModal('experiencia')}
            className="text-orange-400 hover:underline"
          >
            + Agregar experiencia
          </button>
        </div>
        {experiencias.map((exp, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-700">
            <p><strong>Título / Cargo:</strong> {exp.titulo}</p>
            <p><strong>Empresa:</strong> {exp.empresa}</p>
            <p><strong>Descripción:</strong> {exp.descripcion}</p>
          </div>
        ))}
        <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('experiencia')}>
          <span className="text-gray-400">Agrega tu experiencia laboral</span>
        </div>
      </div>
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-4">Educación</h3>
          <button
            onClick={() => openModal('educacion')}
            className="text-orange-400 hover:underline"
          >
            + Agregar educación
          </button>
        </div>
        {educaciones.map((edu, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-700">
            <p><strong>Título / Carrera:</strong> {edu.titulo}</p>
            <p><strong>Institución:</strong> {edu.institucion}</p>
            <p><strong>Año de finalización:</strong> {edu.ano}</p>
          </div>
        ))}
        <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('educacion')}>
          <span className="text-gray-400">Agrega tu formación académica y cursos</span>
        </div>
      </div>
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-4">Habilidades</h3>
          <button
            onClick={() => openModal('habilidades')}
            className="text-orange-400 hover:underline"
          >
            + Agregar habilidad
          </button>
        </div>
        {habilidades.map((hab, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-700">
            <p><strong>Habilidad:</strong> {hab.habilidad}</p>
            <p><strong>Nivel:</strong> {hab.nivel}</p>
          </div>
        ))}
        <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('habilidades')}>
          <span className="text-gray-400">Agrega tus habilidades</span>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        contentLabel="Agregar Información" 
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto my-20 relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">Agregar {modalContent}</h2>
        {modalContent === 'experiencia' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Título / Cargo</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Empresa</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Descripción</label>
              <textarea className="w-full px-4 py-2 border rounded-md"></textarea>
            </div>
          </>
        )}
        {modalContent === 'educacion' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Título / Carrera</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Institución</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Año de finalización</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md" />
            </div>
          </>
        )}
        {modalContent === 'habilidades' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Habilidad</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nivel</label>
              <input type="text" className="w-full px-4 py-2 border rounded-md" />
            </div>
          </>
        )}
        <button onClick={handleAdd} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Agregar</button>
      </Modal>
    </div>
  );
};

export default Profile;
