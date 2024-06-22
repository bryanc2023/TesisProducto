import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Modal from 'react-modal';
import Tabs from './../../components/Postulante/Tabs';
import EditPostulanteModal from '../../components/EditPostulante';
import FormacionPEditar from '../../components/FormacionPEditar';
import EditCurso from '../../components/Postulante/EditCurso';


Modal.setAppElement('#root');

interface ProfileData {
  postulante: {
    foto: string;
    nombres: string;
    apellidos: string;
    fecha_nac: string;
    edad: number;
    estado_civil: string;
    cedula: string;
    genero: string;
    informacion_extra: string;
    idiomas: Idioma[];
  };
  ubicacion: {
    provincia: string;
    canton: string;
  };
  formaciones: Formacion[];
  cursos: Curso[];
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

interface Idioma {
  nivel_oral: string;
  nivel_escrito: string;
  idioma: {
    id: number;
    nombre: string;
  } | null;
}

interface Curso {
  id: number;
  nombre: string;
  institucion: string;
  fechaini: string;
  fechafin: string;
  certificado: string;
}

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedFormacion, setSelectedFormacion] = useState<Formacion | null>(null);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [cedulaError, setCedulaError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (user) {
          const response = await axios.get(`/perfil/${user.id}`);
          const data = response.data;
          if (!data.cursos) {
            data.cursos = [];
          }
          setProfileData(data);
          if (!isCedulaValid(data.postulante.cedula)) {
            setCedulaError('Cédula inválida');
          } else {
            setCedulaError(null);
          }
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
    try {
      if (user) {
        const response = await axios.get(`/perfil/${user.id}`);
        const data = response.data;
        if (!data.cursos) {
          data.cursos = [];
        }
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error reloading profile data:', error);
    }
  };

  const isCedulaValid = (cedula: string): boolean => {
    if (cedula.length !== 10) return false;
    const digits = cedula.split('').map(Number);
    const provinceCode = parseInt(cedula.substring(0, 2), 10);
    if (provinceCode < 1 || provinceCode > 24) return false;
    const verifier = digits.pop();
    const sum = digits.reduce((acc, digit, index) => {
      if (index % 2 === 0) {
        const product = digit * 2;
        return acc + (product > 9 ? product - 9 : product);
      } else {
        return acc + digit;
      }
    }, 0);
    const modulus = sum % 10;
    return modulus === 0 ? verifier === 0 : 10 - modulus === verifier;
  };

  const openModal = (content: string) => {
    setModalContent(content);
    setSelectedFormacion(null);
    setSelectedCurso(null);
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
    setModalContent('formacion');
    setIsModalOpen(true);
  };

  const openEditCursoModal = (curso: Curso) => {
    setSelectedCurso(curso);
    setModalContent('curso');
    setIsModalOpen(true);
  };

  const openEditLanguageModal = (idioma: Idioma) => {
    setSelectedFormacion(idioma);
    setModalContent('editIdioma');
    setIsModalOpen(true);
  };

  const handleProfileUpdate = (updatedProfile: ProfileData) => {
    setProfileData(updatedProfile);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!profileData) {
    return <div className="flex justify-center items-center h-screen">No profile data found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-[#111827] rounded-lg shadow-md text-white pb-6">
      <div className="flex items-center space-x-4">
        <img
          src={profileData.postulante.foto}
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
          <p>
            <strong>Cédula:</strong> {profileData.postulante.cedula}
            {cedulaError && <span className="text-red-500 ml-2">{cedulaError}</span>}
          </p>
          <p><strong>Género:</strong> {profileData.postulante.genero}</p>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded-lg pb-6 shadow-inner text-gray-200">
        <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Información extra</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
          <p><strong>Información Extra:</strong> {profileData.postulante.informacion_extra}</p>
        </div>
      </div>

      <Tabs
        profileData={profileData}
        openEditFormacionModal={openEditFormacionModal}
        handleDeleteFormacion={reloadProfile}
        openModal={openModal}
        openEditLanguageModal={openEditLanguageModal}
        openEditCursoModal={openEditCursoModal}
        handleDeleteCurso={reloadProfile}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar Información"
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto my-20 relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
          &times;
        </button>
        {modalContent === 'formacion' && (
          <FormacionPEditar
            isOpen={isModalOpen}
            closeModal={closeModal}
            reloadProfile={reloadProfile}
            formacion={selectedFormacion}
          />
        )}
        {modalContent === 'curso' && (
          <EditCurso
            isOpen={isModalOpen}
            closeModal={closeModal}
            reloadProfile={reloadProfile}
            curso={selectedCurso}
          />
        )}
        {/* Agrega el contenido de los otros modales aquí */}
      </Modal>

      <EditPostulanteModal
        isOpen={isEditModalOpen}
        closeModal={closeEditModal}
        postulante={profileData.postulante}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default Profile;
