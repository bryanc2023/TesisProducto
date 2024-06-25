import React, { useState, useEffect } from 'react';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';

interface EditCursoProps {
  isOpen: boolean;
  closeModal: () => void;
  reloadProfile: () => void;
  curso: Curso | null;
}

interface Curso {
  id: number;
  nombre: string;
  institucion: string;
  fechaini: string;
  fechafin: string;
  certificado: string;
}

const EditCurso: React.FC<EditCursoProps> = ({ isOpen, closeModal, reloadProfile, curso }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

    fetchProfileData();
  }, [user]);

  const [nombre, setNombre] = useState(curso ? curso.nombre : '');
  const [institucion, setInstitucion] = useState(curso ? curso.institucion : '');
  const [fechaini, setFechaini] = useState(curso ? curso.fechaini : '');
  const [fechafin, setFechafin] = useState(curso ? curso.fechafin : '');
  const [certificado, setCertificado] = useState(curso ? curso.certificado : '');

  useEffect(() => {
    if (curso) {
      setNombre(curso.nombre || '');
      setInstitucion(curso.institucion || '');
      setFechaini(curso.fechaini || '');
      setFechafin(curso.fechafin || '');
      setCertificado(curso.certificado || '');
    }
  }, [curso]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData || !profileData.postulante) {
      console.error("Missing profile data");
      return;
    }

    const updatedCurso = {
      id_postulante: profileData.postulante.id_postulante,
      titulo: nombre,
      certificado: certificado,
    };

    try {
      if (curso) {
        await axios.put(`/certificadoU/${curso.id}`, updatedCurso);
      } else {
        await axios.post('/certificadoC', updatedCurso);
      }
      reloadProfile();
      closeModal();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  if (loading) {
    return <p className="text-gray-400">Cargando...</p>;
  }

  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
      <div className="modal-content bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{curso ? 'Editar Curso' : 'Agregar Curso'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre del Curso</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Certificado (URL)</label>
            <input
              type="url"
              className="w-full px-4 py-2 border rounded-md"
              value={certificado}
              onChange={(e) => setCertificado(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCurso;
