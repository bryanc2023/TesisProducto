import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Modal from 'react-modal';
import FormacionPEditar from '../../components/FormacionPEditar';
import EditPostulanteModal from '../../components/EditPostulante';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';


Modal.setAppElement('#root');

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedFormacion, setSelectedFormacion] = useState<Formacion | null>(null);
  const [cedulaError, setCedulaError] = useState<string | null>(null);
  
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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (user) {
          const response = await axios.get(`/perfil/${user.id}`);
          const data = response.data;
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

  const openModal = (content: string) => {
    setModalContent(content);
    setSelectedFormacion(null);
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

  const openEditFormacionModal = (formacion: string) => {
    setSelectedFormacion(formacion);
    setModalContent('formacion');
    setIsModalOpen(true);
  };


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
    };
    ubicacion: {
      provincia: string;
      canton: string;
    };
    formaciones: Formacion[];
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
          <p>
            <strong>Cédula:</strong> {profileData.postulante.cedula}
            {cedulaError && <span className="text-red-500 ml-2">{cedulaError}</span>}
          </p>
          <p><strong>Género:</strong> {profileData.postulante.genero}</p>
   
        </div>
      </div>
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
        <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Información extra</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong></strong> {profileData.postulante.informacion_extra}</p>
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
        {profileData.formaciones.map((formacion, index) => (
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
        {modalContent === 'cursos' && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-4 text-blue-500">Agregar Curso</h2>
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
          <>
            <h2 className="text-2xl text-center font-semibold mb-4 text-blue-500">Agregar Experiencia</h2>
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
                  <input type="date" className="w-full px-4 py-2 border rounded-md" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Fecha de finalización</label>
                  <input type="date" className="w-full px-4 py-2 border rounded-md" />
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
          </>
        )}

        {modalContent === 'idioma' && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-4 text-blue-500">Agregar Idioma</h2>
            <form className="space-y-4 p-4">
              <p className="text-right text-gray-500 text-sm">*Campos obligatorios</p>
              <div className="grid grid-cols-1 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700">Idioma <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 border rounded-md" required>
                    <option value="">Elige una opción</option>
                    <option value="">Francés</option>
                    <option value="Básico">Portugués</option>
                    <option value="Intermedio">Alemán</option>
                    <option value="Avanzado">Japonés</option>
                    <option value="Nativo">Italiano</option>
                    <option value="Intermedio">Español</option>
                    <option value="Avanzado">Chino Mandarín</option>
                    <option value="Nativo">Coreano</option>
                    <option value="Avanzado">Holandés</option>
                    <option value="Nativo">Quechua</option>
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
          </>
        )}
      </Modal>
      <EditPostulanteModal
        isOpen={isEditModalOpen}
        closeModal={closeEditModal}
        postulante={profileData.postulante}
      />
    </div>
  );
};

export default Profile;
