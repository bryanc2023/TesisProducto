import React, { useState } from 'react';
import axios from "../../services/axios";
import Modal from '../../components/Admin/CargaModal'; 

const Configuracion = () => {
    const [dias, setDias] = useState<number | "">(30); // Estado para el número de días
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', success: false });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDias(value === "" ? "" : parseInt(value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (dias !== "" && dias > 0) {
            setModalContent({ title: 'Cargando...', message: `Guardando configuración...`, success: false });
            setModalOpen(true);

            try {
                const response = await axios.post('/api/configuracion/editarTiempoMaximo', { dias });
                setModalContent({ title: 'Éxito', message: `Configuración guardada correctamente`, success: true });
            } catch (error) {
                console.error('Error guardando configuración:', error);
                setModalContent({ title: 'Error', message: `Error guardando configuración`, success: false });
            }
        } else {
            setModalContent({ title: 'Advertencia', message: 'Por favor, ingrese un número de días válido', success: false });
            setModalOpen(true);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Configuración</h1>
            <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-300 rounded shadow-md bg-white">
                <h2 className="text-xl font-bold mb-2">Tiempo máximo de edición de ofertas</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Días:</label>
                    <input
                        type="number"
                        value={dias}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Guardar
                </button>
            </form>
            <Modal show={modalOpen} onClose={closeModal} title={modalContent.title} success={modalContent.success}>
                <p>{modalContent.message}</p>
            </Modal>
        </div>
    );
};

export default Configuracion;
