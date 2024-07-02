// src/components/Postulante/PostulacionModal.tsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface Oferta {
    id_oferta: number;
    estado: string;
    cargo: string;
    areas: {
        id: number;
        nombre_area: string;
    };
    empresa: {
        id_empresa: string,
        nombre_comercial: string;
        logo: string;
    };
    fecha_max_pos: string;
    n_mostrar_empresa: number;
    modalidad: string;
    carga_horaria: string;
    experiencia: number;
    funciones: string;
    objetivo_cargo: string;
    detalles_adicionales: string;
    criterios: Criterio[];
    expe: {
        titulo: string;
        nivel_educacion: string;
    }[];
    sueldo: string;
    n_mostrar_sueldo: number;
    soli_sueldo: number;
}

interface Criterio {
    criterio: string;
    pivot: {
        valor: string;
    };
}

interface ModalProps {
    oferta: Oferta | null;
    onClose: () => void;
    userId: number | undefined;
}

interface CheckCvResponse {
    hasCv: boolean;
    message: string;
}

const Modal: React.FC<ModalProps> = ({ oferta, onClose, userId }) => {
    const [sueldoDeseado, setSueldoDeseado] = useState<number | null>(null);
    const [checkCvResponse, setCheckCvResponse] = useState<CheckCvResponse | null>(null);

    const fetchCvStatus = async () => {
        try {
            const response = await axios.get(`check-cv/${userId}`);
            setCheckCvResponse(response.data);
        } catch (error) {
            console.error('Error checking CV status:', error);
        }
    };

    useEffect(() => {
        fetchCvStatus();
    }, []);

    const navigate = useNavigate();

    const formatFechaMaxPos = (fecha: string) => {
        const date = new Date(fecha);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    if (!oferta) return null;

    const handlePostular = async () => {
        console.log(`id_usuario: ${userId}, id_oferta: ${oferta.id_oferta}, sueldo: ${sueldoDeseado}`);
        if (oferta.soli_sueldo === 1 && (sueldoDeseado === null || sueldoDeseado === undefined)) {
            Swal.fire({
                title: '¡Error!',
                text: 'El campo de sueldo es obligatorio.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }
        try {
            await fetchCvStatus();

            if (!checkCvResponse?.hasCv) {
                Swal.fire({
                    title: '¡Error!',
                    text: "Parece que no has generado tu cv. Ve a la pestaña CV y generalo antes de postular",
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return;
            }

            const postData = {
                id_postulante: userId,
                id_oferta: oferta.id_oferta,
                sueldo: sueldoDeseado
            };

            await axios.post('postular', postData);
            Swal.fire({
                title: '¡Hecho!',
                text: 'Te has postulado a la oferta seleccionado, verifica el estado de tu postulación en los resultados',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                navigate("/verOfertasAll");
            });
        } catch (error: any) {
            console.error('Error postulando:', error);
            Swal.fire({
                title: '¡Ha ocurrido un error!',
                text: 'Ya has postulado para esta oferta, consulta su estado en la pestaña de "Consultar postulación".',
                icon: 'error',
                confirmButtonText: 'Ok'
            }).then(() => {
                navigate("/verOfertasAll");
            });
        }
    };

    const renderFunciones = () => {
        if (!oferta.funciones) return null;

        if (oferta.funciones.includes(',')) {
            const funcionesList = oferta.funciones.split(',').map((funcion, index) => (
                <li key={index}>+ {funcion.trim()} </li>
            ));
            return <ul> {funcionesList}</ul>;
        } else {
            return <p>{oferta.funciones}</p>;
        }
    };

    const renderDetalles = () => {
        if (!oferta.detalles_adicionales) return null;

        if (oferta.detalles_adicionales.includes(',')) {
            const detallesList = oferta.detalles_adicionales.split(',').map((detalle, index) => (
                <li key={index}>+ {detalle.trim()} </li>
            ));
            return <ul> {detallesList}</ul>;
        } else {
            return <p>{oferta.detalles_adicionales}</p>;
        }
    };

    const renderCriterioValor = (criterio: Criterio) => {
        if (criterio && criterio.pivot && criterio.pivot.valor) {
            const valorArray = criterio.pivot.valor.split(",");

            switch (criterio.criterio) {
                case 'Experiencia':
                    return "Los años mínimos indicados";
                case 'Titulo':
                    return "Alguno de los títulos mencionados";
                case 'Sueldo':
                    return "Indicar el sueldo prospecto a ganar";
                case 'Edad':
                    return valorArray.length > 1 ? valorArray[2].trim() : criterio.pivot.valor;
                case 'Ubicación':
                    return valorArray.length > 1 ? valorArray[1].trim() : criterio.pivot.valor;
                case 'Idioma':
                    return valorArray.length > 1 ? valorArray[1].trim() : criterio.pivot.valor;
                case 'Estado Civil':
                    switch (criterio.pivot.valor) {
                        case "Casado":
                            return "Casado/a";
                        case "Soltero":
                            return "Soltero/a";
                        default:
                            return "Viudo/a";
                    }
                default:
                    return criterio.pivot.valor;
            }
        } else {
            return "";
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-11/12 md:w-1/2 text-center overflow-auto max-h-screen md:max-h-96" style={{ maxHeight: `calc(100vh - 30px)` }}>
                <button onClick={onClose} className="text-white bg-red-500 rounded-full w-8 h-8 absolute top-4 right-4 z-50 flex items-center justify-center">X</button>
                <h2 className="text-xl font-bold mb-4">{oferta.cargo}</h2>
                <div className="flex justify-center items-center mb-4">
                    <img
                        src={oferta.n_mostrar_empresa === 1 ? '/images/anonima.png' : oferta.empresa.logo}
                        alt="Logo"
                        className="w-44 h-24 shadow-lg mr-4"
                    />
                </div>
                <div className="text-center">
                    <div>
                        {oferta.expe.length > 0 && (
                            <>
                                <p className="text-gray-700 mb-1"><strong>Título/s solicitados:</strong></p>
                                <ul>
                                    {oferta.expe.map((titulo, index) => (
                                        <li key={index}>
                                            <p>• {titulo.titulo}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                    <p className="text-gray-700 mb-1"><strong>Empresa:</strong> {oferta.n_mostrar_empresa === 1 ? 'Anónima' : oferta.empresa.nombre_comercial}</p>
                    <p className="text-gray-700 mb-1"><strong>Sueldo:</strong>{oferta.n_mostrar_sueldo === 1 ? 'No descrito' : `${oferta.sueldo}$`}</p>
                    <p className="text-gray-700 mb-1"><strong>Experiencia en cargos similares:</strong> {oferta.experiencia === 0 ? 'No requerida' : `${oferta.experiencia} año/s`}</p>
                    <p className="text-gray-700 mb-1"><strong>Carga Horaria:</strong> {oferta.carga_horaria}</p>
                    <p className="text-gray-700 mb-1"><strong>Fecha Máxima De Postulación:</strong> {formatFechaMaxPos(oferta.fecha_max_pos)}</p>
                </div>
                <div className="text-left">
                    <p className="text-gray-700 mb-1"><strong>Objetivo del cargo:</strong> {oferta.objetivo_cargo}</p>
                    <div>
                        <p className="text-gray-700 mb-1"><strong>Funciones:</strong></p>
                        {renderFunciones()}
                    </div>
                    <div>
                        <p className="text-gray-700 mb-1"><strong>Detalles adicionales:</strong></p>
                        {renderDetalles()}
                    </div>
                    <div>
                        {oferta.criterios.length > 0 ? (
                            <>
                                <p className="text-gray-700 mb-1"><strong>Requisitos adicionales:</strong></p>
                                <p>La empresa especificó que se requiere los siguientes criterios adicionales:</p>
                                <ul>
                                    {oferta.criterios.map((criterio, index) => (
                                        <li key={index}>
                                            <p><strong>⁃ {criterio.criterio}:</strong> {renderCriterioValor(criterio)}</p>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className="text-gray-700 mb-1"></p>
                        )}
                    </div>
                    {oferta.soli_sueldo === 1 && (
                        <div className="mt-4">
                            <label htmlFor="sueldoDeseado" className="text-gray-700 block mb-2"><strong>Ingrese el sueldo deseado a ganar en el trabajo:</strong></label>
                            <input
                                type="number"
                                id="sueldoDeseado"
                                className="w-1/2 p-2 border rounded mr-2"
                                value={sueldoDeseado || ''}
                                onChange={(e) => setSueldoDeseado(parseInt(e.target.value))}
                            />
                        </div>
                    )}
                </div>
                <button onClick={handlePostular} className="mt-4 bg-blue-500 text-white p-2 rounded">Postular</button>
            </div>
        </div>
    );
};

export default Modal;
