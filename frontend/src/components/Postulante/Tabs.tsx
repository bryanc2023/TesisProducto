import React, { useState } from 'react';
import EducationTab from './EducationTab';
import ExperienceTab from './ExperienceTab';
import LanguagesTab from './LanguagesTab';
import CoursesTab from './CoursesTab';

interface TabsProps {
  profileData: ProfileData;
  openEditFormacionModal: (formacion: Formacion | null) => void;
  handleDeleteFormacion: (id: number) => void;
  openModal: (content: string) => void;
  openEditLanguageModal: (idioma: Idioma) => void;
  openEditCursoModal: (curso: Curso | null) => void;
  handleDeleteCurso: (id: number) => void;
}

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

const Tabs: React.FC<TabsProps> = ({ profileData, openEditFormacionModal, handleDeleteFormacion, openModal, openEditLanguageModal, openEditCursoModal, handleDeleteCurso }) => {
  const [activeTab, setActiveTab] = useState('education');

  const renderContent = () => {
    switch (activeTab) {
      case 'education':
        return (
          <EducationTab
            formaciones={profileData.formaciones}
            openEditFormacionModal={openEditFormacionModal}
            handleDeleteFormacion={handleDeleteFormacion}
          />
        );
      case 'experience':
        return <ExperienceTab openModal={openModal} />;
      case 'languages':
        return (
          <LanguagesTab
            idiomas={profileData.postulante.idiomas}
            openEditLanguageModal={openEditLanguageModal}
            openModal={openModal}
          />
        );
      case 'courses':
        return (
          <CoursesTab
            cursos={profileData.cursos}
            openEditCursoModal={openEditCursoModal}
            handleDeleteCurso={handleDeleteCurso}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-6">
      <div className="flex space-x-4">
        <button onClick={() => setActiveTab('education')} className={`py-2 px-4 rounded-t-lg ${activeTab === 'education' ? 'bg-gray-800 text-white' : 'bg-gray-400 text-black'}`}>
          Educación
        </button>
        <button onClick={() => setActiveTab('experience')} className={`py-2 px-4 rounded-t-lg ${activeTab === 'experience' ? 'bg-gray-800 text-white' : 'bg-gray-400 text-black'}`}>
          Experiencia
        </button>
        <button onClick={() => setActiveTab('languages')} className={`py-2 px-4 rounded-t-lg ${activeTab === 'languages' ? 'bg-gray-800 text-white' : 'bg-gray-400 text-black'}`}>
          Idiomas
        </button>
        <button onClick={() => setActiveTab('courses')} className={`py-2 px-4 rounded-t-lg ${activeTab === 'courses' ? 'bg-gray-800 text-white' : 'bg-gray-400 text-black'}`}>
          Cursos
        </button>
      </div>
      <div className="p-4 bg-gray-700 rounded-b-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default Tabs;
