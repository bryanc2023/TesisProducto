import { useState, useRef, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser, faEnvelope, faSearch, faChevronDown, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

function PostulanteLayout() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); 
    const dispatch = useDispatch();
  
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { // Especifica el tipo de event como MouseEvent
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) { // Asegúrate de que event.target sea Node
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
  
    return (
      <div>
        {/* Top Nav */}
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center w-full fixed top-0 z-10">
          <div>
            <span>ProaJob</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
              <FontAwesomeIcon icon={faBuilding} className="mr-2" />
              <span className="hidden lg:inline">Postulante</span>
              <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md overflow-hidden z-20">
                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                  <Link to="/mi-perfil">Mi Perfil</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                  <Link to="/mi-cv">Mi CV</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                  <Link to="/mi-cuenta">Mi Cuenta</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                  <Link to="/"  onClick={() => dispatch(logout())}   >Cerrar Sesión</Link>
                </li>
              </ul>
            )}
          </div>
          <button className="lg:hidden flex items-center focus:outline-none" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>
        </nav>
  
        <div className="flex pt-16">
          {/* Lateral Nav */}
          <nav style={{ backgroundColor: '#111827' }} className={`w-1/6 text-white p-4 fixed top-12 bottom-0 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="flex flex-col items-center mb-4">
              <img
                src="https://via.placeholder.com/100"
                alt="Foto de Perfil"
                className="rounded-full profile-image"
              />
              <span className="mt-2 hidden lg:block">Nombre del Usuario</span>
            </div>
            <ul>
              <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
                <Link to="/verOfertasAll" className="flex items-center w-full">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  <span className="hidden lg:inline">Realizar Postulación</span>
                </Link>
              </li>
              <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
                <Link to="/resultadosP" className="flex items-center w-full">
                  <FontAwesomeIcon icon={faSearch} className="mr-2" />
                  <span className="hidden lg:inline">Consulta de Resultados</span>
                </Link>
              </li>
              <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
                <Link to="/perfilP" className="flex items-center w-full">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  <span className="hidden lg:inline">Mi Perfil</span>
                </Link>
              </li>
            </ul>
          </nav>
  
          {/* Main Content */}
          <div className="w-5/6 p-4 ml-auto">
            <Outlet />
          </div>
        </div>
      </div>
    );
}

export default PostulanteLayout