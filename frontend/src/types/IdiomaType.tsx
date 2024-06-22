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