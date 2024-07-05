import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars, faTimes, faClipboardList, faUsers, faChartLine, faUser } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import axios from '../../services/axios';
import { RootState } from '../../store';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid'
import ListPostulantes from '../Empresa/ListPostulantes';
import instance from '../../services/axios';
import ListEmpresa from '../Empresa/ListEmpresa';
import PerfilPModal from '../../components/PerfilPModal';
import PerfilEModal from '../../components/PerfilEModal';
import Postulante from '../../../api/Postulante';

interface Empresa {
    id_empresa: number;
    nombre_comercial: string;
    logo: string;
}

interface Postulante {
    id_postulante: number
    nombres: string
    apellidos: string
    foto: string
}

interface Idioma {
    id_idioma: number;
    idioma_nombre: string;
    nivel_oral: string;
    nivel_escrito: string;
}

interface Formacion {
    id_titulo: number;
    institucion: string;
    estado: string;
    fecha_ini: Date;
    fecha_fin: Date;
    titulo_acreditado: string;
}

interface Red {
    id_postulante_red: number;
    nombre_red: string;
    enlace: string;
}

interface FormacionPro {
    id_formacion_pro: number;
    empresa: string;
    puesto: string;
    fecha_ini: Date;
    fecha_fin: Date;
    descripcion_responsabilidades: string;
    persona_referencia: string;
    contacto: string;
    anios_e: number;
    area: string;
    mes_e: number;
}

interface Certificado {
    id_certificado: number;
    titulo: string;
    certificado: string;
}

export interface PostulanteData {
    postulante:{
        id_postulante: number;
        nombres: string;
        apellidos: string;
        fecha_nac: Date;
        foto: string;
        edad: number;
        estado_civil: string;
        cedula: string;
        genero: string;
        informacion_extra: string;
        cv: string;
    },
    idiomas: Idioma[];
    formaciones: Formacion[];
    red: Red[];
    formapro: FormacionPro[];
    certificados: Certificado[];
}

interface Sector {
    id: number;
    sector: string;
    division: string;
}

interface Red {
    nombre_red: string;
    enlace: string;
}


interface Ubicacion {
    provincia: string;
    canton: string;
}

interface EmpresaData {
    
    nombre_comercial: string;
    tamanio: string;
    descripcion: string;
    logo: string;
    cantidad_empleados: number;
    ubicacion: Ubicacion;
    sector: Sector;    
    red: Red[];
}

const initialPostulanteData: PostulanteData = {
    postulante: {} as PostulanteData['postulante'],
    idiomas: [],
    formaciones: [],
    red: [],
    formapro: [],
    certificados: []
};

const initialEmpresaData: EmpresaData = {
    nombre_comercial: '',
    tamanio: '',
    descripcion: '',
    logo: '',
    cantidad_empleados: 0,
    sector: {
        id: 0, // Inicializa con valores apropiados
        sector: '',
        division: ''
    },
    ubicacion: {
        provincia: '',
        canton: ''
    },
    red: []
};

function EmpresaLayout() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const dropdownRef = useRef<HTMLDivElement>(null);

    //Controla lo que selecciona el usuario Postulante o empresa
    const [select, setSelect] = useState(1)

    //Postulantes -----------------------------------------------------------------------------------
    const [query, setQuery] = useState('') //Guardara el nombre y apellido del postulante
    const [postulantes, setPostulantes] = useState<Postulante[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isModal, setIsmodal] = useState(false)

    //modal para ver la información completa del postulante
    const [isModalPost, setIsModalPost] = useState(false)
    const [isLoadingPost, setIsLoadingPost] = useState(false)
    const [dataPost, setDataPost] = useState<PostulanteData>(initialPostulanteData)

    //Empresa -----------------------------------------------------------------------------------
    const [queryEmpresa, setQueryEmpresa] = useState('')
    const [empresas, setEmpresas] = useState<Empresa[]>([])
    const [isLoadingEmpresas, setIsLoadingEmpresas] = useState(false)
    const [isModalEmpresas, setIsModalEmpresas] = useState(false)

    //modal para ver la información completa del postulante
    const [isModalEmpresa, setIsModalEmpresa] = useState(false)
    const [isLoadingEmpresa, setIsLoadingEmpresa] = useState(false)
    const [dataEmpresa, setDataEmpresa] = useState<EmpresaData>(initialEmpresaData)

    const dispatch = useDispatch();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleContentClick = () => {
        if (sidebarOpen) {
            setSidebarOpen(false);
        }
    };

    useEffect(() => {
        const fetchEmpresa = async () => {
            if (user) {
                try {
                    const response = await axios.get<Empresa>(`http://localhost:8000/api/empresaById/${user.id}`);
                    setEmpresa(response.data);
                } catch (err) {
                    console.error('Error fetching empresa data:', err);
                }
            }
        };

        fetchEmpresa();
    }, [user]);

    const getLogoUrl = (logoPath: string) => {
        return logoPath.startsWith('http') ? logoPath : `http://localhost:8000/storage/${logoPath}`;
    };

    //Busca a todos los postulantes
    const searchPostulante = async () => {
        try {
            setIsLoading(true)
            setIsmodal(true)
            const { data } = await instance.get('postulanteByName', {
                params: {
                    'nombre_apellido': query
                }
            });

            setPostulantes(
                data
            )

        } catch (error) {
            setPostulantes([]);
        } finally {
            setIsLoading(false)
        }
    }

    //Datos de la emprsa
    const searchEmpresa = async () => {
        try {
            setIsLoadingEmpresas(true)
            setIsModalEmpresas(true)
            
            const { data } = await instance.get('getEmpresaByName', {
                params: {
                    'nombre_comercial': queryEmpresa
                }
            });

            setEmpresas(data)

        } catch (error) {
            console.log(error)
            setEmpresas([])
        } finally {
            setIsLoadingEmpresas(false)
        }
    }

    //Evento para buscar cuando de enter:
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            searchPostulante();
        }
    };

    const handleKeyDownEmpresa = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            searchEmpresa()
        }
    }

    const closeModal = () => {
        setIsmodal(false)
    }

    const closeModalEmpresa = () => {
        setIsModalEmpresas(false)
    }

    //Comprueba si esta vacio el query para cerrar el modal
    useEffect(() => {
        if (!query) {
            setIsmodal(false)
        }
        if (!queryEmpresa) {
            setIsModalEmpresas(false)
        }
    }, [query, queryEmpresa])

    // Maneja el cambio de selección
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelect(Number(event.target.value));
    };

    //Use effect para limpiar la consulta
    useEffect(() => {
        if (select === 1) {
            setQueryEmpresa('');  // Limpia el query relacionado con empresas
            setEmpresas([])
            setIsModalEmpresas(false)

        } else if (select === 2) {
            setQuery('');
            setPostulantes([]);
            setIsmodal(false);
        }

    }, [select]);

    //Función para traer los datos completos del postulante y abrir el modal
    const getPostulante = async (postulanteData: Postulante) => {
        try {
            setIsLoadingPost(true)
            setIsModalPost(true)

            //Consulto a la API
            const { data } = await Postulante.getDataPostulante(postulanteData.id_postulante)
            setDataPost(data)
         

        } catch (error) {
            console.log(error)

        } finally {
            setIsLoadingPost(false)
        }
    }

    //Funcion para traer los datos completos de la empresa y abrir el modal
    const getEmpresa = async (idEmpresa: Empresa['id_empresa']) => {
        try {
            setIsLoadingEmpresa(true)
            setIsModalEmpresa(true)

            const { data } = await instance.get(`getEmpresaById/${idEmpresa}`)
            setDataEmpresa(data)
            

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingEmpresa(false)
        }
    }

    return (
        <div className={`flex h-screen overflow-hidden ${(isModalPost || isModalEmpresa) && ' opacity-50'}`} onClick={handleContentClick}>
            {/* Lateral Nav */}
            <nav className={`bg-orange-700 text-white p-4 fixed top-16 bottom-0 lg:relative lg:translate-x-0 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-64 z-20`}>
                <div className="flex flex-col items-center mb-4">
                    {empresa && (
                        <img
                            src={getLogoUrl(empresa.logo)}
                            alt="Foto de Perfil"
                            className="rounded-full profile-image w-24 h-24 object-cover border-4 border-white"
                        />
                    )}
                    <span className="mt-2">{empresa ? empresa.nombre_comercial : 'Nombre del Usuario'}</span>
                </div>
                <ul>
                    <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
                        <Link to="/verOfertasE" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                            <span>Gestión de Ofertas</span>
                        </Link>
                    </li>
                    <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
                        <Link to="/ConsPost" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faUsers} className="mr-2" />
                            <span>Consultar Postulantes</span>
                        </Link>
                    </li>
                    <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
                        <Link to="/MoniR" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                            <span>Monitoreo de Reclutamiento</span>
                        </Link>
                    </li>
                    <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
                        <Link to="/PerfilE" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            <span>Mi perfil</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Top Nav */}
                <nav className="bg-orange-700 text-white p-4 flex justify-between items-center gap-2 w-full fixed top-0 left-0 right-0 z-30">
                    <div>
                        <span className=' font-bold'>ProaJob Empresa</span>
                    </div>

                    <div className=' w-1/2 relative'>
                        <div className=' bg-white rounded-lg text-gray-700 flex gap-1 p-2'>
                            <MagnifyingGlassIcon className=' w-5' />

                            {
                                select === 1 ?
                                    (
                                        <input
                                            type='text'
                                            className=' w-full focus:outline-none'
                                            placeholder='Buscar postulante por el nombre, apellido'
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            value={query}
                                        />
                                    )
                                    :
                                    (
                                        <input
                                            type='text'
                                            className=' w-full focus:outline-none'
                                            placeholder='Buscar postulante por el nombre de la empresa'
                                            onChange={(e) => setQueryEmpresa(e.target.value)}
                                            onKeyDown={handleKeyDownEmpresa}
                                            value={queryEmpresa}
                                        />
                                    )

                            }

                            <select
                                className='focus:outline-none'
                                value={select}
                                onChange={handleSelectChange}
                            >
                                <option value={1}>Postulantes</option>
                                <option value={2}>Empresas</option>
                            </select>

                        </div>

                        {/** Contenedor  para los resultados de la busqueda de postulante */

                            isModal &&
                            <div className=' absolute w-full'>
                                <div className=' bg-white rounded-md p-2 mt-5 shadow-xl'>
                                    <div className=' flex justify-between text-gray-700 items-center mb-5'>

                                        <p className=' font-bold text-lg'> Lista de resultados </p>
                                        <button onClick={closeModal}>
                                            <XMarkIcon className=' w-4' />
                                        </button>
                                    </div>


                                    {
                                        isLoading ?
                                            <p className=' text-center text-white'>cargando resultados</p>
                                            :
                                            postulantes?.length > 0 ?
                                                postulantes?.map(postulante => (
                                                    <ListPostulantes
                                                        key={postulante.id_postulante}
                                                        postulante={postulante}
                                                        getPostulante={getPostulante}
                                                    />
                                                ))
                                                :
                                                <p className=' text-center font-bold text-red-500 '>
                                                    --------- No hay resultados ---------
                                                </p>

                                    }

                                </div>
                            </div>
                        }

                        {/** Contenedor  para los resultados de la busqueda de empresas */
                            isModalEmpresas &&
                            <div className=' absolute w-full'>
                                <div className=' bg-white rounded-md p-2 mt-5 shadow-xl'>
                                    <div className=' flex justify-between text-gray-700 items-center mb-5'>

                                        <p className=' font-bold text-lg'> Lista de resultados </p>
                                        <button onClick={closeModalEmpresa}>
                                            <XMarkIcon className=' w-4' />
                                        </button>
                                    </div>


                                    {
                                        isLoadingEmpresas ?
                                            <p className=' text-center text-white'>cargando resultados</p>
                                            :
                                            empresas?.length > 0 ?
                                                empresas?.map(empresa => (
                                                    <ListEmpresa
                                                        key={empresa.id_empresa}
                                                        empresa={empresa}
                                                        getEmpresa={getEmpresa}

                                                    />
                                                ))
                                                :
                                                <p className=' text-center font-bold text-red-500 '>
                                                    --------- No hay resultados ---------
                                                </p>

                                    }

                                </div>
                            </div>
                        }
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                            {empresa && (
                                <img
                                    src={getLogoUrl(empresa.logo)}
                                    alt="Logo"
                                    className="w-8 h-8 object-cover border-2 border-white rounded-full mr-2"
                                />
                            )}
                            <span className="hidden lg:inline">{empresa ? empresa.nombre_comercial : 'Empresa oferente'}</span>
                            <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                        </button>
                        {dropdownOpen && (
                            <ul className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md overflow-hidden z-20">
                                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                                    <Link to="/employer/profile">Profile</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                                    <Link to="/employer/jobs">Jobs</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                                    <Link to="/employer/account">Account</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                                    <Link to="/" onClick={() => dispatch(logout())}>Cerrar Sesión</Link>
                                </li>
                            </ul>
                        )}
                    </div>
                    <button className="lg:hidden flex items-center focus:outline-none" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
                    </button>
                </nav>

                <PerfilPModal
                    isModalPost={isModalPost}
                    closeModal={() => setIsModalPost(false)}
                    dataPost={dataPost}
                    isLoadingPost={isLoadingPost}
                />

                <PerfilEModal
                    isModalEmpresa={isModalEmpresa}
                    closeModalEmpresa={() => setIsModalEmpresa(false)}
                    dataEmpresa={dataEmpresa}
                    isLoadingEmpresa={isLoadingEmpresa}
                />

                <div className="flex-1 p-4 mt-16 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default EmpresaLayout;
