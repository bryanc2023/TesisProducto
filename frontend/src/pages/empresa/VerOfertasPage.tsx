import { Link } from 'react-router-dom';
import { useState } from "react";

import ModalOfer from '../../components/ModalOfer'; // Asegúrate de que la ruta es correcta
import PublicarOPage from './PublicarOPage';

function VerOfertasPPage() {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="w-full p-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <h1 className="text-2xl font-semibold mb-4">OFERTAS DISPONIBLES:</h1>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="py-3 px-6">ID</th>
                            <th scope="col" className="py-3 px-6">Estado</th>
                            <th scope="col" className="py-3 px-6">Área</th>
                            <th scope="col" className="py-3 px-6">Discapacidad</th>
                            <th scope="col" className="py-3 px-6">Modalidad</th>
                            <th scope="col" className="py-3 px-6">Carga Horaria</th>
                            <th scope="col" className="py-3 px-6">Salario</th>
                            <th scope="col" className="py-3 px-6">Título Requerido</th>
                            <th scope="col" className="py-3 px-6">Experiencia Mínima</th>
                            <th scope="col" className="py-3 px-6">Detalle</th>
                            <th scope="col" className="py-3 px-6">Empresa</th>
                            <th scope="col" className="py-3 px-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Campos de prueba para los títulos de la tabla */}
                        <tr className="bg-gray-100">
                            <td className="py-4 px-6">1</td>
                            <td className="py-4 px-6">Activo</td>
                            <td className="py-4 px-6">Tecnología</td>
                            <td className="py-4 px-6">No</td>
                            <td className="py-4 px-6">Remoto</td>
                            <td className="py-4 px-6">40 horas/semana</td>
                            <td className="py-4 px-6">$3000</td>
                            <td className="py-4 px-6">Ingeniero en Sistemas</td>
                            <td className="py-4 px-6">2 años</td>
                            <td className="py-4 px-6">Desarrollar aplicaciones web</td>
                            <td className="py-4 px-6">TechCorp</td>
                            <td className="py-4 px-6">
                                <Link to={`/postulantes/1`} className="text-blue-600 hover:underline">Ver Postulantes</Link>
                            </td>
                        </tr>
                        {/* Nueva fila con datos adicionales */}
                        <tr className="bg-gray-200">
                            <td className="py-4 px-6">2</td>
                            <td className="py-4 px-6">Cerrado</td>
                            <td className="py-4 px-6">Marketing</td>
                            <td className="py-4 px-6">Sí</td>
                            <td className="py-4 px-6">Presencial</td>
                            <td className="py-4 px-6">30 horas/semana</td>
                            <td className="py-4 px-6">$2500</td>
                            <td className="py-4 px-6">Licenciado en Marketing</td>
                            <td className="py-4 px-6">3 años</td>
                            <td className="py-4 px-6">Gestionar campañas publicitarias</td>
                            <td className="py-4 px-6">MarketCorp</td>
                            <td className="py-4 px-6">
                                <Link to={`/postulantes/2`} className="text-blue-600 hover:underline">Ver Postulantes</Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <Link to="/iniciop" className="text-blue-600 hover:underline">Inicio</Link>
                <button
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    onClick={handleShowModal}
                >
                    Agregar oferta
                </button>
            </div>

            {/* Modal */}
            <ModalOfer show={showModal} onClose={handleCloseModal}>
                <PublicarOPage />
            </ModalOfer>
        </div>
    );
}

export default VerOfertasPPage;
