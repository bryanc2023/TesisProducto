import React, { useEffect, useState } from 'react';
import { FaEye, FaDownload } from 'react-icons/fa';
import axios from '../../services/axios'; // Importa tu instancia de axios
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface CV {
  id: number;
  nombre: string;
  url: string; // URL del CV
}

const CurriTab: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        if (user) {
          setLoading(true);
          const response = await axios.get(`postulante/${user.id}/cv`);
          console.log('Response data:', response.data); // Agregar log para ver la respuesta
          const data = response.data;
          setCvs([{ id: user.id, nombre: user.name, url: data.cv_url }]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al obtener el CV:', error);
        setError('Error al obtener el CV');
        setLoading(false);
      }
    };

    fetchCVs();
  }, [user]);

  const handleViewCV = (url: string) => {
    setPreviewUrl(url);
  };

  const handleDownloadCV = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'CV.pdf'; // Nombre del archivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Currículos</h2>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        cvs.length > 0 ? (
          cvs.map((cv, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-700 relative flex">
              <div style={{ flex: '0 0 200px', height: '200px', border: '1px solid rgba(0, 0, 0, 0.3)' }}>
                <iframe
                  src={cv.url}
                  width="100%"
                  height="100%"
                  title={`Vista previa del CV de ${cv.nombre}`}
                ></iframe>
              </div>
              <div className="ml-4 flex flex-col justify-between">
                <p><strong>Nombre:</strong> {cv.nombre}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleViewCV(cv.url)}
                    className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadCV(cv.url)}
                    className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    <FaDownload className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay currículos disponibles en este momento.</p>
        )
      )}

      {previewUrl && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Vista previa del CV</h3>
          <iframe
            src={previewUrl}
            width="100%"
            height="750px"
            style={{ border: '1px solid rgba(0, 0, 0, 0.3)' }}
            title="Vista previa del CV"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default CurriTab;
