import React, { useState, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faChevronDown, faBars, faTimes, faClipboardList, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';

import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

function EmpresaLayout() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      {/* Top Nav */}
      <nav style={{ backgroundColor: '#d1552a' }} className="text-white p-4 flex justify-between items-center w-full fixed top-0 z-10">
        <div>
          <span>ProaJob Empresa</span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
            <span className="hidden lg:inline">Empresa oferente</span>
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
        <nav style={{ backgroundColor: '#d1552a' }} className={`w-1/6 text-white p-4 fixed top-16 bottom-0 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
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
              <Link to="/verOfertasE" className="flex items-center w-full">
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                <span className="hidden lg:inline">Gestión de Ofertas</span>
              </Link>
            </li>
            <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
              <Link to="/ConsPost"  className="flex items-center w-full">
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                <span className="hidden lg:inline">Consultar Postulantes</span>
              </Link>
            </li>
            <li className="mb-4 flex items-center hover:bg-gray-700 rounded-md p-2">
              <Link to="/MoniR" className="flex items-center w-full">
                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                <span className="hidden lg:inline">Monitoreo de Reclutamiento</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="w-5/6 p-4 ml-auto overflow-auto h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default EmpresaLayout;
