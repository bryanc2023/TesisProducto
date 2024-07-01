import React, { useEffect, useState, useRef } from 'react';
import { FaEye, FaDownload } from 'react-icons/fa';
import axios from '../../services/axios'; // Importa tu instancia de axios
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { storage } from '../../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface CV {
  id: number;
  nombre: string;
  url: string; // URL del CV
}

interface Ubicacion {
  id: number;
  provincia: string;
  canton: string;
  created_at: string;
  updated_at: string;
}

interface Titulo {
  id: number;
  nivel_educacion: string;
  campo_amplio: string;
  titulo: string;
  created_at: string;
  updated_at: string;
}

interface Formacion {
  id_postulante: number;
  id_titulo: number;
  institucion: string;
  estado: string;
  fecha_ini: string;
  fecha_fin: string | null;
  titulo_acreditado: string;
  titulo: Titulo;
}

interface Idioma {
  id_postulante: number;
  id_idioma: number;
  nivel_oral: string;
  nivel_escrito: string;
  idioma: {
      id: number;
      nombre: string;
      created_at: string;
      updated_at: string;
  };
}

interface RedSocial {
  id_postulante_red: number;
  id_postulante: number;
  nombre_red: string;
  enlace: string;
  created_at: string;
  updated_at: string;
}

interface Certificado {
  id_certificado: number;
  id_postulante: number;
  titulo: string;
  certificado: string;
  created_at: string;
  updated_at: string;
}

interface FormacionProfesional {
  id_formacion_pro: number;
  id_postulante: number;
  empresa: string;
  puesto: string;
  fecha_ini: string;
  fecha_fin: string;
  descripcion_responsabilidades: string;
  persona_referencia: string;
  contacto: string;
  anios_e: number;
  area: string;
  created_at: string;
  updated_at: string;
}

interface PostulanteData {
  postulante: {
      id_postulante: number;
      id_ubicacion: number;
      id_usuario: number;
      nombres: string;
      apellidos: string;
      fecha_nac: string;
      edad: number;
      estado_civil: string;
      cedula: string;
      genero: string;
      informacion_extra: string;
      foto: string;
      cv: string;
      ubicacion: Ubicacion;
      formaciones: Formacion[];
      idiomas: Idioma[];
      red: RedSocial[];
      certificado: Certificado[];
      formapro: FormacionProfesional[];
  };
}
const CurriTab: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<PostulanteData | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const photoRef = useRef<HTMLImageElement>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        if (user) {
          setLoading(true);
          const response = await axios.get(`/postulante/${user.id}/cv`);
          const data = response.data;
          setCvs([{ id: user.id, nombre: user.name, url: data.cv_url }]);
          const [profileResponse, imageResponse] = await Promise.all([
            axios.get(`/curri/${user.id}`),
            axios.get(`/foto/${user.id}`, { responseType: 'blob' })
          ]);
  
          const imageURL = URL.createObjectURL(imageResponse.data);
  
          setProfileData(profileResponse.data);
          setImageSrc(imageURL);
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

  

  const generatePDF = async () => {
  
    
  
    if (!profileData || !profileData.postulante) {
      console.error('No hay datos de perfil disponibles para generar el PDF.');
      return;
    }
  

    const doc = new jsPDF();
    let yOffset = 10; // Offset para manejar el espacio vertical en el PDF

    const addSection = (title: string) => {
      doc.setFontSize(16);
      doc.setTextColor(40, 116, 240);
      doc.text(title, 10, yOffset);
      yOffset += 10;
      doc.setFontSize(12);
      doc.setTextColor(0);
    };

    if (imageLoaded && photoRef.current) {
      const canvas = await html2canvas(photoRef.current);
      const imgData = canvas.toDataURL('image/jpeg');
      const imgWidth = 70; // Ancho de la imagen en el PDF
      const imgHeight = 50; // Calcula la altura proporcionalmente

      const pdfWidth = doc.internal.pageSize.getWidth();

      const margin = 10;
      const x = pdfWidth - imgWidth - margin;
      const y = margin;

      // Agregar la imagen al PDF
      doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
    }

    const addText = (text: string) => {
      doc.text(text, 10, yOffset);
      yOffset += 10;

      // Verificar si es necesario agregar una nueva página
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 10; // Reiniciar el offset en la nueva página
      }
    };

    // Datos del perfil
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(`${profileData.postulante.nombres} ${profileData.postulante.apellidos}`, 10, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    addText(`Fecha de Nacimiento: ${profileData.postulante.fecha_nac}`);
    addText(`Edad: ${profileData.postulante.edad}`);
    addText(`Estado Civil: ${profileData.postulante.estado_civil}`);
    addText(`Cédula: ${profileData.postulante.cedula}`);
    addText(`Género: ${profileData.postulante.genero}`);

    // Información extra
    addSection('Presentación');
    addText(profileData.postulante.informacion_extra || '');

    // Redes
    if (profileData.postulante.red) {
      addSection('Redes');
      profileData.postulante.red.forEach((red) => {
        addText(`${red.nombre_red}: ${red.enlace}`);
      });
    }

    // Formación académica
    if (profileData.postulante.formaciones) {
      addSection('Formación Académica');
      profileData.postulante.formaciones.forEach((formacion) => {
        addText(`Institución: ${formacion.institucion}`);
        addText(`Título: ${formacion.titulo.titulo}`);
        addText(`Fecha de Inicio: ${formacion.fecha_ini}`);
        addText(`Fecha de Fin: ${formacion.fecha_fin}`);
        yOffset += 5; // Espacio adicional entre formaciones
      });
    }

    // Cursos
    if (profileData.postulante.certificado) {
      addSection('Cursos');
      profileData.postulante.certificado.forEach((curso) => {
        addText(`Nombre del Curso: ${curso.titulo}`);
        addText(`Certificado: ${curso.certificado}`);
        yOffset += 5; // Espacio adicional entre cursos
      });
    }

    // Experiencia
    if (profileData.postulante.formapro) {
      addSection('Experiencia');
      profileData.postulante.formapro.forEach((exp) => {
        addText(`Empresa: ${exp.empresa}`);
        addText(`Puesto: ${exp.puesto}`);
        addText(`Fecha de Inicio: ${exp.fecha_ini}`);
        addText(`Fecha de Fin: ${exp.fecha_fin}`);
        yOffset += 5; // Espacio adicional entre experiencias
      });
    }

    // Idiomas
    if (profileData.postulante.idiomas) {
      addSection('Idiomas');
      profileData.postulante.idiomas.forEach((idioma) => {
        addText(`Idioma: ${idioma.idioma.nombre}`);
        addText(`Nivel Oral: ${idioma.nivel_oral}`);
        addText(`Nivel Escrito: ${idioma.nivel_escrito}`);
        yOffset += 5; // Espacio adicional entre idiomas
      });
    }

    // Guardar el documento PDF
    const pdfBlob = doc.output('blob');
    const pdfFileName = `${profileData.postulante.nombres}_${profileData.postulante.apellidos}_CV.pdf`;

    try {
      const storageRef = ref(storage, `cvs/${pdfFileName}`);
      await uploadBytes(storageRef, pdfBlob);
      const downloadURL = await getDownloadURL(storageRef);
         // Actualizar la vista previa del CV
         setPreviewUrl(downloadURL);

      // Enviar el URL del CV generado a tu API Laravel
      const apiUrl = `/postulantes/${profileData.postulante.id_usuario}/cv`;
      await axios.put(apiUrl, { cv: downloadURL });

      console.log('URL del CV generado:', downloadURL);
      
      Swal.fire({
        icon: 'success',
        title: '!Hoja de vida lista!',
        text: 'Se ha actualizado/generado tu hoja de vida correctamente',
      }).then(() => {
        navigate("/perfilP");
        
      });
    } catch (error) {
      console.error('Error al subir el PDF a Firebase Storage:', error);
    }
  };


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
        <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Currículo</h2>
        {loading ? (
          <></>) :(
        <button onClick={generatePDF}>
  { profileData?.postulante.cv != null ? '¿Has añadido/modificado información?: Actualiza tu CV' : 'Generar CV'}
</button>)}
            
            {imageSrc && (
                <div>
                    
                    <img
                        ref={photoRef}
                        src={imageSrc}
                        alt="Foto de perfil"
                        style={{
                            width: '400px',  // Ancho en la interfaz web
                            height: '300px', // Altura en la interfaz web
                                 // Opacidad cero para ocultar en la interfaz web
                            position: 'absolute', // Asegura que no ocupe espacio visible
                            zIndex: -1,           // Coloca detrás de otros elementos
                        }}
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>
            )}
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        
        cvs.length > 0 && profileData?.postulante.cv !=null ? (
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
          <p>Aun no has generado tu hoja de vida.</p>
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
