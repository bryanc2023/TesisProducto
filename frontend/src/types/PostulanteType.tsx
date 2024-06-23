interface Postulante {
    id_usuario: number;
    foto: string;
    nombres: string;
    apellidos: string;
    fecha_nac: string;
    edad: number;
    estado_civil: string;
    cedula: string;
    genero: string;
    informacion_extra: string;
    provincia: string;
    canton: string;
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
  