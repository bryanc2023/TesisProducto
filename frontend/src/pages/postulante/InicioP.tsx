import { Link } from 'react-router-dom';

import { useState, useEffect, useRef } from "react";
import '../css/RegisterPage.css';

function InicioP() {


  return (
    <div className="w-full p-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <h1 className="text-2xl font-semibold mb-4">OFERTAS DISPONIBLES:</h1>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="py-3 px-6">ID</th>
                        <th className="py-3 px-6">Estado</th>
                        <th className="py-3 px-6">Área</th>
                        <th className="py-3 px-6">Discapacidad</th>
                        <th className="py-3 px-6">Modalidad</th>
                        <th className="py-3 px-6">Carga Horaria</th>
                        <th className="py-3 px-6">Salario</th>
                        <th className="py-3 px-6">Título Requerido</th>
                        <th className="py-3 px-6">Experiencia Mínima</th>
                        <th className="py-3 px-6">Detalle</th>
                        <th className="py-3 px-6">Empresa</th>
                    </tr>
                </thead>
                <tbody>
                   
                </tbody>
            </table>
        </div>
        <Link to="/iniciop" className="inline-block mt-4 text-blue-600 hover:underline">Inicio</Link>
    </div>
);
}

export default InicioP