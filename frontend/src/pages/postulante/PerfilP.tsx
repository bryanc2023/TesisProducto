import React, { useState, useEffect } from 'react';

import Modal from '../../components/ModalPer'; 

function PerfilP() {
   
    const [perfil, setPerfil] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        telefono: '',
        experiencia: [],
        educacion: [],
        habilidades: [],
        foto: ''
    });

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                
            } catch (error) {
                console.error('Error obteniendo perfil:', error);
            }
        };

        fetchPerfil();
    }, []);

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setPerfil((prevPerfil) => ({
            ...prevPerfil,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Guardar los cambios en la experiencia, educación o habilidades
        setModalOpen(false);
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            
        } catch (error) {
            console.error('Error actualizando perfil:', error);
        }
    };

    const openModal = (type:any) => {
        setModalContent(type);
        setModalOpen(true);
    };

    return (
        <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4 custom-margin-top">
           
            <div className="w-full lg:w-3/4">
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={perfil.nombre}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Apellidos</label>
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={perfil.apellidos}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={perfil.correo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Teléfono</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={perfil.telefono}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                            Guardar Cambios
                        </button>
                    </form>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold mb-4">Experiencia Laboral</h3>
                        <button
                            onClick={() => openModal('experiencia')}
                            className="text-pink-600 hover:underline"
                        >
                            + Agregar experiencia
                        </button>
                    </div>
                    <div className="border border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('experiencia')}>
                        <span className="text-gray-600">Agrega tu experiencia laboral</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold mb-4">Educación</h3>
                        <button
                            onClick={() => openModal('educacion')}
                            className="text-pink-600 hover:underline"
                        >
                            + Agregar educación
                        </button>
                    </div>
                    <div className="border border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('educacion')}>
                        <span className="text-gray-600">Agrega tu formación académica y cursos</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold mb-4">Habilidades</h3>
                        <button
                            onClick={() => openModal('habilidades')}
                            className="text-pink-600 hover:underline"
                        >
                            + Agregar habilidad
                        </button>
                    </div>
                    <div className="border border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer" onClick={() => openModal('habilidades')}>
                        <span className="text-gray-600">Agrega tus habilidades</span>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} title={`Agregar ${modalContent}`}>
                {modalContent === 'experiencia' && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700">Título / Cargo</label>
                            <label></label>
                            <input type="text" className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Empresa</label>
                            <input type="text" className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Descripción</label>
                            <textarea className="w-full px-4 py-2 border rounded-md"></textarea>
                        </div>
                    </>
                )}
                {modalContent === 'educacion' && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700">Título / Carrera</label>
                            <input type="text" className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Institución</label>
                            <input type="text" className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Año de finalización</label>
                            <input type="text" className="w-full px-4 py-2 border rounded-md" />
                        </div>
                    </>
                )}
                {modalContent === 'habilidades' && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700">Habilidad</label>
                            <input type="text" className="w-full px-4 py-2 border rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Nivel</label>
                            <input type="text" className="w-full px-4 py-2 border rounded-md" />
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}

export default PerfilP;
