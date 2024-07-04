import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { FaLinkedin, FaFacebook, FaInstagram, FaXTwitter, FaGlobe, FaEye } from 'react-icons/fa6'; 
import { PostulanteData } from './layout/EmpresaLayout';

const iconMap = {
    'facebook': FaFacebook,
    'twitter': FaXTwitter,
    'linkedin': FaLinkedin,
    'instagram': FaInstagram,
    'website': FaGlobe,
};

interface PerfilPModalProps {
    isModalPost: boolean;
    closeModal: () => void;
    dataPost: PostulanteData;
    isLoadingPost: boolean;
}

const PerfilPModal: React.FC<PerfilPModalProps> = ({ isModalPost, closeModal, dataPost, isLoadingPost }) => {
    console.log('desde el ', dataPost);
    return (
        <Dialog open={isModalPost} onClose={closeModal} className="relative z-50">
            <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <DialogPanel className="w-full max-w-3xl max-h-screen p-6 bg-white border-2 border-gray-300 shadow-lg overflow-y-auto">
                    <DialogTitle className="font-bold text-lg text-center text-orange-500">Detalles del postulante</DialogTitle>

                    {!isLoadingPost ? (
                        <div>
                            <div className='grid grid-cols-1  flex-wrap gap-5 mt-10'>
                                <div className='w-full md:w-1/2'>
                                    <img src={dataPost.postulante.foto || ''} alt="Foto de perfil" className="w-24 h-24 object-cover border-2 border-gray-300 rounded-full mx-auto md:mx-0" />
                                </div>
                                <div className='w-full md:w-1/2'>
                                        <p className='text-lg text-orange-500 font-semibold'>
                                            Nombre completo: <span className='font-normal'>{`${dataPost.postulante.nombres || ''} ${dataPost.postulante.apellidos || ''}`}</span>
                                        </p>
                                        <p className='text-gray-700 font-semibold'>
                                            Cedula: <span className='font-normal'>{dataPost.postulante.cedula || ''}</span>
                                        </p>
                                    
                                    <p className='text-gray-700 font-semibold'>
                                        Fecha de nacimiento: <span className='font-normal'>{dataPost.postulante.fecha_nac ? new Date(dataPost.postulante.fecha_nac).toLocaleDateString() : ''}</span>
                                    </p>

                                    <p className='text-gray-700 font-semibold'>
                                        Edad: <span className='font-normal'>{dataPost.postulante.edad || ''}</span>
                                    </p>

                                    <p className='text-gray-700 font-semibold'>
                                        Estado civil: <span className='font-normal'>{dataPost.postulante.estado_civil || ''}</span>
                                    </p>

                                    <p className='text-gray-700 font-semibold'>
                                        Genero: <span className='font-normal'>{dataPost.postulante.genero || ''}</span>
                                    </p>

                                    <p className='text-gray-700 font-semibold'>
                                        Detalles: <span className='font-normal'>{dataPost.postulante.informacion_extra || ''}</span>
                                    </p>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <p className='text-gray-700 font-semibold text-center md:text-left'>
                                    <a href={dataPost.postulante.cv} target="_blank" rel="noopener noreferrer" className='text-blue-700 underline'>
                                        Ver CV
                                    </a>
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <p className='text-center mt-4 text-lg text-orange-500'>Idiomas</p>
                                    {dataPost.idiomas.length > 0 ? (
                                        dataPost.idiomas.map(idioma => (
                                            <div key={idioma.id_idioma}>
                                                <p className='text-gray-700 font-semibold'>Idioma: <span className='font-normal'>{idioma.idioma_nombre}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Nivel escrito: <span className='font-normal'>{idioma.nivel_escrito}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Nivel oral: <span className='font-normal'>{idioma.nivel_oral}</span> </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className='text-gray-500 text-center'>No hay datos</p>
                                    )}
                                </div>
                                <div>
                                    <p className='text-center mt-4 text-lg text-orange-500'>Formaciones</p>
                                    {dataPost.formaciones.length > 0 ? (
                                        dataPost.formaciones.map(formacion => (
                                            <div key={formacion.id_titulo}>
                                                <p className='text-gray-700 font-semibold'>Institución: <span className='font-normal'>{formacion.institucion}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Estado: <span className='font-normal'>{formacion.estado}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Fecha de Inicio: <span className='font-normal'>{new Date(formacion.fecha_ini).toLocaleDateString()}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Fecha de Fin: <span className='font-normal'>{new Date(formacion.fecha_fin).toLocaleDateString()}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Título: <span className='font-normal'>{formacion.titulo_acreditado}</span> </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className='text-gray-500 text-center'>No hay datos</p>
                                    )}
                                </div>
                                <div>
                                    <p className='text-center mt-4 text-lg text-orange-500'>Redes</p>
                                    {dataPost.red.length > 0 ? (
                                        dataPost.red.map(red => {
                                            const Icon = iconMap[red.nombre_red.toLowerCase()] || FaGlobe;
                                            return (
                                                <div key={red.id_postulante_red} className="flex items-center">
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
                                <div>
                                    <p className='text-center mt-4 text-lg text-orange-500'>Experiencia Profesional</p>
                                    {dataPost.formapro.length > 0 ? (
                                        dataPost.formapro.map(formacion => (
                                            <div key={formacion.id_formacion_pro}>
                                                <p className='text-gray-700 font-semibold'>Empresa: <span className='font-normal'>{formacion.empresa}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Puesto: <span className='font-normal'>{formacion.puesto}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Fecha de Inicio: <span className='font-normal'>{new Date(formacion.fecha_ini).toLocaleDateString()}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Fecha de Fin: <span className='font-normal'>{new Date(formacion.fecha_fin).toLocaleDateString()}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Descripción: <span className='font-normal'>{formacion.descripcion_responsabilidades}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Persona de referencia: <span className='font-normal'>{formacion.persona_referencia}</span> </p>
                                                <p className='text-gray-700 font-semibold'>Contacto: <span className='font-normal'>{formacion.contacto}</span> </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className='text-gray-500 text-center'>No hay datos</p>
                                    )}
                                </div>
                                <div>
                                    <p className='text-center mt-4 text-lg text-orange-500'>Certificados</p>
                                    {dataPost.certificados.length > 0 ? (
                                        dataPost.certificados.map(certificado => (
                                            <div key={certificado.id_certificado} className='mb-4 flex items-center justify-between'>
                                                <p className='text-gray-700 font-semibold'>Título: <span className='font-normal'>{certificado.titulo}</span> </p>
                                                <a href={certificado.certificado} target="_blank" rel="noopener noreferrer" className='text-blue-700 underline ml-2 flex items-center'>
                                                    <FaEye className='mr-1' /> Ver certificado
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <p className='text-gray-500 text-center'>No hay datos</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className='text-xl mt-5 text-orange-500 text-center'>Cargando la información ...</p>
                    )}

                    <button
                        onClick={closeModal}
                        className='bg-orange-500 px-3 py-2 rounded-lg shadow-sm text-white font-semibold mt-5'
                    >
                        Cerrar
                    </button>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default PerfilPModal;
