import React, { useEffect, useState, useRef } from 'react';
import { FaEye, FaDownload } from 'react-icons/fa';
import axios from '../../services/axios'; // Importa tu instancia de axios
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import jsPDF from 'jspdf';
import { storage } from '../../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import logoImg from '../../assets/images/marca.png';
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

     // Función para agregar una marca de agua
    // Función para agregar la imagen de marca de agua
    const addWatermark = () => {
      // Ajustar las coordenadas y dimensiones de la marca de agua según sea necesario
     // Ajustar las coordenadas y dimensiones de la marca de agua según sea necesario
     const totalPages = doc.internal.pages.length;
     const imgWidth = 150; // Ancho de la marca de agua en el PDF
     const imgHeight = 150; // Altura de la marca de agua en el PDF
     const pdfWidth = doc.internal.pageSize.getWidth();
     const pdfHeight = doc.internal.pageSize.getHeight();
     for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i); // Establecer la página actual
     const x = pdfWidth / 2 - imgWidth / 2; // Centrar horizontalmente
     const y = pdfHeight / 2 - imgHeight / 2; // Centrar verticalmente
     
  

  // Agregar la imagen de marca de agua con opacidad
  doc.addImage(logoImg, 'PNG', x, y, imgWidth, imgHeight);
}
 
    };

    const addSection = (title: string) => {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold'); // Establecer texto en negrita
      doc.setTextColor(255, 165, 0); // Color naranja en formato RGB
      doc.text(title, 10, yOffset);
      const titleHeight = 10; // Altura del título
      const lineHeight = 1; // Altura de la línea separadora

      // Dibujar línea naranja debajo del título
      doc.setDrawColor(255, 165, 0); // Color naranja en formato RGB
      doc.setLineWidth(lineHeight); // Grosor de la línea
      doc.line(10, yOffset + titleHeight, doc.internal.pageSize.width - 10, yOffset + titleHeight); // Línea horizontal
      yOffset += titleHeight + lineHeight; // Ajustar yOffset
      yOffset += 10;
      doc.setFont('helvetica', 'normal'); // Restaurar la fuente a normal para el texto siguiente
      doc.setFontSize(12);
      doc.setTextColor(0); // Restaurar color negro para el texto siguiente

    };


    const addText = (text: string) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const textWidth = pageWidth - margin * 2;

      const lines = doc.splitTextToSize(text, textWidth);

      lines.forEach((line: string) => {
        const parts = line.split(':'); // Dividir cada línea en dos partes: antes y después de los dos puntos
        if (parts.length === 2) {
          // Si hay dos partes después de dividir por ':', aplicar cursiva a la primera parte
          const normalFont = doc.getFont(); // Guardar la fuente actual
          const fontSize = 12; // Tamaño de fuente
          const fontStyle = 'italic'; // Estilo de fuente cursiva

          // Medir el ancho de la primera parte para ajustar la posición de la segunda parte
          const part1Width = doc.getStringUnitWidth(parts[0]) * fontSize / doc.internal.scaleFactor;

          doc.setFont(normalFont.fontName, fontStyle); // Cambiar a la variante cursiva de la fuente actual
          doc.text(parts[0], 10, yOffset); // Agregar la primera parte (antes de los dos puntos)

          // Calcular la posición X para la segunda parte
          const part2X = 10 + part1Width + 2; // Añadir un pequeño espacio entre la primera y la segunda parte

          doc.setFont(normalFont.fontName, normalFont.fontStyle); // Restaurar la fuente normal para la segunda parte
          doc.text(`: ${parts[1]}`, part2X, yOffset); // Agregar la segunda parte (después de los dos puntos)
        } else {
          // Si no hay dos puntos, agregar el texto completo sin cursiva
          doc.text(line, 10, yOffset);
        }

        yOffset += 10; // Incrementar el offset vertical para la siguiente línea

        // Verificar si es necesario agregar una nueva página
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 10; // Reiniciar el offset en la nueva página
        }
      });
    };


    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = async () => {
        const imgWidth = 70; // Ancho de la imagen en el PDF
        const imgHeight = 50; // Calcula la altura proporcionalmente
        const pdfWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
        const x = pdfWidth - imgWidth - margin;
        const y = margin;

        // Agregar la imagen al PDF
        doc.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);

               

        // Continuar con el resto del contenido del PDF después de que la imagen se haya cargado
        // Aquí puedes agregar más contenido al PDF usando doc.text() u otros métodos de jsPDF

        // Datos del perfil
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        const fullName = `${profileData.postulante.nombres.toUpperCase()} ${profileData.postulante.apellidos.toUpperCase()}`;
        doc.text(fullName, 10, yOffset);
        yOffset += 10;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold'); // Establecer texto en negrita
        doc.setTextColor(255, 165, 0); // Color naranja en formato RGB
        doc.text('INFORMACIÓN PERSONAL', 10, yOffset);
        yOffset += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(0);
        addText(`Fecha de Nacimiento: ${profileData.postulante.fecha_nac}`);
        addText(`Edad: ${profileData.postulante.edad}`);
        addText(`Estado Civil: ${profileData.postulante.estado_civil}`);
        addText(`Cédula: ${profileData.postulante.cedula}`);
        addText(`Género: ${profileData.postulante.genero}`);


        // Ubicación

        addSection('UBICACIÓN');



        addText(`Provincia: ${profileData.postulante.ubicacion.provincia}`);
        addText(`Canton: ${profileData.postulante.ubicacion.canton}`);


        yOffset += 5;  // Ajusta el espacio adicional según sea necesario


        // Información extra
        addSection('PRESENTACIÓN');
        addText(profileData.postulante.informacion_extra || '');



        // Formación académica
        if (profileData.postulante.formaciones.length > 0) {
          addSection('FORMACIÓN ACADÉMICA');
          profileData.postulante.formaciones.forEach((formacion) => {
            const startDate = format(new Date(formacion.fecha_ini), 'MMM-yyyy');
            const endDate = formacion.fecha_fin ? format(new Date(formacion.fecha_fin), 'MMM-yyyy') : 'Presente';
            doc.setFont('helvetica', 'bold');
            addText(`${formacion.titulo_acreditado}`);
            doc.setFont('helvetica', 'normal');
            addText(`${formacion.titulo.nivel_educacion} en ${formacion.titulo.campo_amplio}`);
            addText(`Institución: ${formacion.institucion}`);
            addText(`Fechas: ${startDate} - ${endDate}`);


            yOffset += 5;  // Ajusta el espacio adicional según sea necesario
          });
        }

        // Cursos
        if (profileData.postulante.certificado.length > 0) {
          addSection('CERTIFICACIONES');
          profileData.postulante.certificado.forEach((curso) => {
            doc.setFont('helvetica', 'bold');
            addText(`${curso.titulo}`);
            doc.setFont('helvetica', 'normal');
            addText(`Enlace del certificado: ${curso.certificado}`);
            yOffset += 5; // Espacio adicional entre cursos
          });
        }

        // Experiencia
        if (profileData.postulante.formapro.length > 0) {
          addSection('FORMACIÓN PROFESIONAL');
          profileData.postulante.formapro.forEach((exp) => {
            const startDate = format(new Date(exp.fecha_ini), 'MMM-yyyy');
            const endDate = exp.fecha_fin ? format(new Date(exp.fecha_fin), 'MMM-yyyy') : 'Presente';
            doc.setFont('helvetica', 'bold');
            addText(`${exp.empresa}`);
            doc.setFont('helvetica', 'normal');
            addText(`Puesto: ${exp.puesto}`);
            addText(`Responsabilidades: ${exp.descripcion_responsabilidades}`);
            // Manejo especial para mostrar solo la parte después de la coma en exp.area
            const areaText = exp.area.split(',')[1].trim(); // Obtener la parte después de la coma y eliminar espacios en blanco
            addText(`Area: ${areaText}`);
            addText(`Fechas: ${startDate} - ${endDate}`);
            yOffset += 5; // Espacio adicional entre experiencias
          });
        }

        // Idiomas
        if (profileData.postulante.idiomas.length > 0) {
          addSection('REFERENCIAS');
          profileData.postulante.formapro.forEach((exp) => {
            // Texto en negrita para persona_referencia
            doc.setFont('helvetica', 'bold');
            addText(`${exp.persona_referencia}`);

            // Texto normal para los otros campos
            doc.setFont('helvetica', 'normal');
            addText(`Perteneciente a: ${exp.empresa}`);
            addText(`Contacto: ${exp.contacto}`);

            yOffset += 5; // Espacio adicional entre experiencias
          });
        }

        // Referencias
        if (profileData.postulante.formapro.length > 0) {
          addSection('IDIOMAS');
          profileData.postulante.idiomas.forEach((idioma) => {
            doc.setFont('helvetica', 'bold');
            addText(` ${idioma.idioma.nombre}`);
            doc.setFont('helvetica', 'normal');
            addText(`Nivel Oral: ${idioma.nivel_oral}`);
            addText(`Nivel Escrito: ${idioma.nivel_escrito}`);
            yOffset += 5; // Espacio adicional entre idiomas
          });
        }
        // Redes
        if (profileData.postulante.red.length > 0) {
          addSection('REDES');
          profileData.postulante.red.forEach((red) => {
            addText(`${red.nombre_red}: ${red.enlace}`);
          });
        }

// Agregar marca de agua
addWatermark();

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
          })
           handleViewCV(downloadURL);
        } catch (error) {
          console.error('Error al subir el PDF a Firebase Storage:', error);
        }
      };
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
          <></>) : (
          <button onClick={generatePDF}>
            {profileData?.postulante.cv != null ? '¿Has añadido/modificado información?: Actualiza tu CV' : 'Generar CV'}
          </button>)}


      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (

        cvs.length > 0 && profileData?.postulante.cv != null ? (
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
