import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { FaLinkedin, FaFacebook, FaInstagram, FaXTwitter, FaGlobe } from 'react-icons/fa6'; 
import { EmpresaData } from './layout/EmpresaGLayout';

const iconMap = {
    'facebook': FaFacebook,
    'twitter': FaXTwitter,
    'linkedin': FaLinkedin,
    'instagram': FaInstagram,
    'website': FaGlobe,
};

interface PerfilEModalProps {
    isModalEmpresa: boolean;
    closeModalEmpresa: () => void;
    dataEmpresa: EmpresaData;
    isLoadingEmpresa: boolean;
}

const PerfilEModal: React.FC<PerfilEModalProps> = ({ isModalEmpresa, closeModalEmpresa, dataEmpresa, isLoadingEmpresa }) => {
    return (
        <Dialog open={isModalEmpresa} onClose={closeModalEmpresa} className="relative z-50">
            <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <DialogPanel className="w-full max-w-3xl max-h-screen p-6 bg-white border-2 border-gray-300 shadow-lg overflow-y-auto">
                    <DialogTitle className="font-bold text-lg text-center text-orange-500">Detalles de la empresa</DialogTitle>

                    {!isLoadingEmpresa ? (
                        <div>
                            <div className='flex flex-wrap gap-5 mt-10'>
                                <div className='w-full md:w-1/2 flex items-center md:items-start'>
                                    <img src={dataEmpresa.logo} alt="Foto de perfil" className="w-24 h-24 object-cover border-2 border-gray-300 rounded-full" />
                                    <div className='ml-5 mt-5 md:mt-0'>
                                        <p className='text-lg text-orange-500 font-semibold'>
                                            Nombre comercial: <span className='font-normal'>{dataEmpresa.nombre_comercial}</span>
                                        </p>
                                        <p className='text-gray-700 font-semibold'>
                                            Descripción: <span className='font-normal'>{dataEmpresa.descripcion}</span>
                                        </p>
                                        <p className='text-gray-700 font-semibold'>
                                            Cantidad de empleados: <span className='font-normal'>{dataEmpresa.cantidad_empleados}</span>
                                        </p>
                                        <p className='text-gray-700 font-semibold'>
                                            Tamaño: <span className='font-normal'>{dataEmpresa.tamanio}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className='flex-1 w-full md:w-1/2'>
                                    <div className='mb-5'>
                                        <p className='text-center md:text-left text-lg text-orange-500'>Sector</p>
                                        {dataEmpresa.sector && (
                                            <div>
                                               <p className='text-gray-700 font-semibold'>
                                                Sector: <span className='font-normal ml-1'>{dataEmpresa.sector.sector}</span>
                                                </p>
                                                <p className='text-gray-700 font-semibold'>División: <span className='font-normal'>{dataEmpresa.sector.division}</span></p>
                                            </div>
                                        )}
                                    </div>
                                    <div className='mb-5'>
                                        <p className='text-center md:text-left text-lg text-orange-500'>Ubicación</p>
                                        <p className='text-gray-700 font-semibold'>Provincia:  <span className='font-normal'>{dataEmpresa.ubicacion.provincia}</span></p>
                                        <p className='text-gray-700 font-semibold'>Cantón:  <span className='font-normal'>{dataEmpresa.ubicacion.canton}</span></p>
                                    </div>
                                    <div>
                                        <p className='text-center md:text-left text-lg text-orange-500'>Redes</p>
                                        {dataEmpresa.red.length > 0 ? (
                                            dataEmpresa.red.map((red, index) => {
                                                const Icon = iconMap[red.nombre_red.toLowerCase()] || FaGlobe;
                                                return (
                                                    <div key={index} className="flex items-center mb-2">
                                                        <Icon className='text-blue-500' />
                                                        <a href={red.enlace} target="_blank" rel="noopener noreferrer" className='text-blue-700 underline ml-2'>
                                                            {red.nombre_red}
                                                        </a>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className='text-gray-500 text-center'>No hay datos</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className='text-xl mt-5 text-orange-500 text-center'>Cargando la información ...</p>
                    )}

                    <button
                        onClick={closeModalEmpresa}
                        className='bg-orange-500 px-3 py-2 rounded-lg shadow-sm text-white font-semibold mt-5'
                    >
                        Cerrar
                    </button>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default PerfilEModal;
