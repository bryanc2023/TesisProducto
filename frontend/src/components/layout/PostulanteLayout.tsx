import { useState, useRef, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faSearch, faChevronDown, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import axios from '../../services/axios';
import { RootState } from '../../store';

function PostulanteLayout() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef, sidebarOpen]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                if (user) {
                    const response = await axios.get(`/perfil/${user.id}`);
                    setProfileData(response.data);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Lateral Nav */}
            <nav ref={sidebarRef} className={`bg-gray-900 text-white p-4 fixed top-16 bottom-0 lg:relative lg:translate-x-0 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-64 z-20`}>
                <div className="flex flex-col items-center mb-4">
                    <img
                        src={profileData ? profileData.postulante.foto : 'https://via.placeholder.com/100'}
                        alt="Foto de Perfil"
                        className="rounded-full profile-image w-24 h-24 object-cover border-4 border-white"
                    />
                    <span className="mt-2">{user ? `${user.name} ` : 'Nombre del Usuario'}</span>
                </div>
                <ul>
                     {/*
                    <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
                        <Link to="/inicio" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                            <span>Inicio</span>
                        </Link>
                    </li>
                    */}
                    <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
                        <Link to="/verOfertasAll" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                            <span>Realizar Postulación</span>
                        </Link>
                    </li>
                    <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
                        <Link to="/resultadosP" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faSearch} className="mr-2" />
                            <span>Consulta de Resultados</span>
                        </Link>
                    </li>
                    <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
                        <Link to="/perfilP" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            <span>Mi Perfil</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Top Nav */}
                <nav className="bg-gray-900 text-white p-4 flex justify-between items-center w-full fixed top-0 left-0 right-0 z-30">
                    <div>
                        <span>ProaJob</span>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                            <img
                                src={profileData ? profileData.postulante.foto : 'https://via.placeholder.com/30'}
                                alt="Foto de Perfil"
                                className="rounded-full w-8 h-8 object-cover mr-2"
                            />
                            <span className="hidden lg:inline">{user ? `${user.name} ` : 'Postulante'}</span>
                            <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                        </button>
                        {dropdownOpen && (
                            <ul className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md overflow-hidden z-20">
                                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                                    <Link to="/perfilP">Mi Perfil</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                                    <Link to="/mi-cv">Mi CV</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                                    <Link to="">Mi Cuenta</Link>
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

                <div className="flex-1 p-4 mt-16 overflow-auto"> {/* Add mt-16 to avoid content going under the fixed navbar */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default PostulanteLayout;
