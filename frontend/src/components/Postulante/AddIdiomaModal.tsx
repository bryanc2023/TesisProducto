import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import AddIdiomaModal from './AddIdiomaModal';
import EditIdiomaModal from './EditIdiomaModal';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface LanguagesTabProps {
  idiomas: Idioma[];
}

interface Idioma {
  nivel_oral: string;
  nivel_escrito: string;
  idioma: {
    id: number;
    nombre: string;
  } | null;
}

const LanguagesTab: React.FC<LanguagesTabProps> = ({ idiomas }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIdioma, setSelectedIdioma] = useState<Idioma | null>(null);
  const [languages, setLanguages] = useState<{ id: number; nombre: string }[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profileData, setProfileData] = useState<Postulante | null>(null);

  const reloadProfile = async () => {
    try {
      if (user) {
        const response = await axios.get(`/perfil/${user.id}`);
        setProfileData(response.data);
        const response2 = await axios.get('idiomas');
        setLanguages(response2.data.idiomas);
      }
    } catch (error) {
      console.error('Error reloading profile data:', error);
    }
  };

  useEffect(() => {
    axios.get('idioma')
      .then(response => {
        setLanguages(response.data.idiomas);
      })
      .catch(error => {
        console.error('Error fetching languages:', error);
      });
  }, []);

  useEffect(() => {
    const fetchIdiomas = async () => {
      try {
        const response = await axios.get('/idioma');
        if (response.data && Array.isArray(response.data.idiomas)) {
          setLanguages(response.data.idiomas);
        } else {
          setLanguages([]);
        }
      } catch (error) {
        console.error('Error fetching idiomas:', error);
        setLanguages([]);
      }
    };

    fetchIdiomas();
  }, []);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (idioma: Idioma) => {
    setSelectedIdioma(idioma);
    setIsEditModalOpen(true);
  };

  const handleIdiomaAdded = async () => {
    setIsAddModalOpen(false);
    await reloadIdiomas(); // Reload idiomas after adding
  };

  const handleIdiomaUpdated = async () => {
    setIsEditModalOpen(false);
    await reloadIdiomas(); // Reload idiomas after updating
  };

  const reloadIdiomas = async () => {
    try {
      const response = await axios.get('/idioma');
      if (response.data && Array.isArray(response.data.idiomas)) {
        setLanguages(response.data.idiomas);
      } else {
        setLanguages([]);
      }
    } catch (error) {
      console.error('Error reloading idiomas:', error);
      setLanguages([]);
    }
  };

  const handleLanguageSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newLanguage = {
      userId: user?.id,
      idiomaId: formData.get('idiomaId'),
      nivelEscrito: formData.get('nivelEscrito'),
      nivelOral: formData.get('nivelOral'),
    };

    try {
      await axios.post('nuevoidioma', newLanguage);
      setSuccessMessage('Idioma agregado correctamente');
      reloadProfile();
      setIsAddModalOpen(false); // Cierra el modal
    } catch (error) {
      setErrorMessage('Error agregando el idioma');
      console.error('Error adding language:', error);
    }
  };

  const handleEditLanguageSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (profileData && selectedIdioma) {
      const formData = new FormData(event.currentTarget);
      const updatedLanguage = {
        nivelOral: formData.get('nivelOral'),
        nivelEscrito: formData.get('nivelEscrito'),
      };

      try {
        await axios.put(`/updateIdioma/${profileData.postulante.id}/${selectedIdioma.idioma?.id}`, updatedLanguage);
        setSuccessMessage('Idioma actualizado correctamente');
        reloadProfile();
        setIsEditModalOpen(false); // Cierra el modal
      } catch (error) {
        setErrorMessage('Error actualizando el idioma');
        console.error('Error updating language:', error);
      }
    } else {
      setErrorMessage('Error: Información del idioma o postulante no disponible.');
    }
  };

  return (
    <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold mb-4">Idiomas</h3>
        <button onClick={handleOpenAddModal} className="text-orange-400 hover:underline">
          + Agregar idioma
        </button>
      </div>
      {idiomas.length > 0 ? (
        idiomas.map((idioma, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-700 relative">
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => handleOpenEditModal(idioma)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
              >
                <FaPencilAlt className="w-4 h-4" />
              </button>
              <button
                className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-rose-300 mr-2"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
            <p><strong>Idioma:</strong> {idioma.idioma?.nombre}</p>
            <p><strong>Nivel Oral:</strong> {idioma.nivel_oral}</p>
            <p><strong>Nivel Escrito:</strong> {idioma.nivel_escrito}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No hay idiomas disponibles en este momento.</p>
      )}
      <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer" onClick={handleOpenAddModal}>
        <span className="text-gray-400">Agrega tu idioma</span>
      </div>
      {user && (
        <AddIdiomaModal
          isOpen={isAddModalOpen}
          onRequestClose={() => setIsAddModalOpen(false)}
          onIdiomaAdded={handleIdiomaAdded}
          languages={languages}
          userId={user.id}
        />
      )}
      {selectedIdioma && (
        <EditIdiomaModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          idioma={selectedIdioma}
          onIdiomaUpdated={handleIdiomaUpdated}
        />
      )}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default LanguagesTab;
