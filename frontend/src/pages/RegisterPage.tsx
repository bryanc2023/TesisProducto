import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/layout/Navbar';

function RegisterPage() {
  return (
    <div>
      <Navbar />  
     
    <div className="flex justify-center items-center h-screen gap-5 bg-gray-100">
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <Link to="/registerE" className="w-48 h-48 bg-gray-800 shadow-lg flex flex-col justify-center items-center rounded-lg text-white no-underline transition-colors duration-300 hover:text-gray-400">
          <FontAwesomeIcon icon={faBuilding} className="text-5xl mb-5" />
          <div className="flex gap-2">
            <span className="font-bold">Soy empresa</span>
          </div>
        </Link>
        <Link to="/register" className="w-48 h-48 bg-[#c2410c] shadow-lg flex flex-col justify-center items-center rounded-lg text-white no-underline transition-colors duration-300 hover:text-gray-400">
          <FontAwesomeIcon icon={faUser} className="text-5xl mb-5" />
          <div className="flex gap-2">
            <span className="font-bold">Soy postulante</span>
          </div>
        </Link>
      </div>
    </div>
    </div> 
  );
}

export default RegisterPage;
