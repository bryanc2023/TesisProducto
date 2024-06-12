import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

import EditPostulanteModal from '../../components/EditPostulante';
import EditFormacionModal from '../../components/FormacionPEditar';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';


const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFormacion, setSelectedFormacion] = useState<Formacion | null>(null);


  interface Postulante {
    foto: string;
    nombres: string;
    apellidos: string;
    fecha_nac: string;
    edad: number;
    estado_civil: string;
    cedula: string;
    genero: string;
    informacion_extra?: string;
  }

  interface Formacion {
    id: number;
    institucion: string;
    estado: string;
    fechaini: string;
    fechafin: string;
    titulo: {
      titulo: string;
      nivel_educacion: string;
      campo_amplio: string;
    };
  }

  interface Ubicacion {
    provincia: string;
    canton: string;
  }

  interface ProfileData {
    postulante: Postulante;
    ubicacion: Ubicacion;
    formaciones?: Formacion[];
  }


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (user) {
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

  const reloadProfile = async () => {
    if (user) {
      const response = await axios.get(`/perfil/${user.id}`);
      setProfileData(response.data);
    }
  };

  const openModal = (content: string) => {
    setModalContent(content);
    setSelectedFormacion(null); // Clear the selected formacion
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openEditFormacionModal = (formacion: Formacion) => {
    setSelectedFormacion(formacion);
    setIsModalOpen(true);
  };

  const handleDeleteFormacion = async (id: number) => {
    try {
      await axios.delete(`formacion/${id}`);
      reloadProfile();
    } catch (error) {
      console.error('Error deleting formacion:', error);
    }
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
          <button onClick={openEditModal} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Editar Datos</button>
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
        </div>
      </div>
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
        <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Detalles del Perfil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>Información Extra:</strong> {profileData.postulante.informacion_extra}</p>
        </div>
      </div>
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Formación Académica</h2>
          <button
            onClick={() => openModal('formacion')}
            className="text-orange-400 hover:underline"
          >
            + Agregar educación
          </button>
        </div>
        {profileData.formaciones && profileData.formaciones.map((formacion, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-700 relative">
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => openEditFormacionModal(formacion)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
              >
                <FaPencilAlt className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteFormacion(formacion.id)}
                className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-rose-300 mr-2"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
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
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Cursos y Capacitaciones</h3>
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
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Experiencia Laboral</h3>
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
          <h3 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Idiomas</h3>
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
      <EditFormacionModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        formacion={selectedFormacion}
        reloadProfile={reloadProfile}
      />
      <EditPostulanteModal
        isOpen={isEditModalOpen}
        closeModal={closeEditModal}
        postulante={profileData.postulante}
      />
    </div>
  );
};

export default Profile;
