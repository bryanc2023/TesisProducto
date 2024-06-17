import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "../../services/axios";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Oferta {
    id_oferta: number;
    estado: string;
    cargo: string;
    areas: {
        id:number;
        nombre_area: string;
    };
    empresa: {
        id_empresa: string,
        nombre_comercial: string;
        logo: string;
    };
    fecha_max_pos: string;
    mostrar_empresa: number;
    modalidad: string;
    carga_horaria: string;
    experiencia: string;
    funciones:string;
    objetivo_cargo:string;
    detalles_adicionales:string;
    criterios: Criterio[];
    expe: {
        titulo: string;
        nivel_educacion: string;
    }[];
    sueldo:string;
    mostrar_sueldo: number;
    // Define otros campos de la oferta según sea necesario
}
interface Idioma {
    id: number;
    nombre: string;
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
    userId: number| undefined;
}

interface Area {
    id: number;
    nombre_area: string;
}

function Modal({ oferta, onClose, userId }: ModalProps) {
    const [idiomas, setIdiomas] = useState<{ [key: number]: string }>({});
   
    useEffect(() => {
        const fetchIdiomas = async () => {
            try {
                const response = await axios.get('idioma'); // Cambia la URL a la correcta
                const idiomasData = response.data.idiomas.reduce((acc: { [key: number]: string }, idioma: Idioma) => {
                    acc[idioma.id] = idioma.nombre;
                    return acc;
                }, {});
                setIdiomas(idiomasData);
            } catch (error) {
                console.error('Error fetching idiomas:', error);
            }
        };

        fetchIdiomas();
    }, []);
    const navigate = useNavigate();

       // Función para formatear fecha
       const formatFechaMaxPos = (fecha: string) => {
        const date = new Date(fecha);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };
    if (!oferta) return null;
    const handlePostular = async () => {
        console.log(`id_usuario: ${userId}, id_oferta: ${oferta.id_oferta}`);
        try {
            await axios.post('postular', {
                id_postulante: userId,
                id_oferta: oferta.id_oferta,
            });
            Swal.fire({
                title: '¡Hecho!',
                text: 'Te has postulado a la oferta seleccionado, verifica el estado de tu postulación en los resultados',
                icon: 'success',
                confirmButtonText: 'Ok'
              }).then(() => {
                navigate("/inicio");
              });
        } catch (error) {
            console.error('Error postulando:', error);
            alert('Hubo un error al postular. Intenta nuevamente.');
        }
    };

    const renderFunciones = () => {
        if (!oferta.funciones) return null;

        // Verificar si hay comas en funciones
        if (oferta.funciones.includes(',')) {
            // Dividir las funciones por comas y renderizar como lista con viñetas
            const funcionesList = oferta.funciones.split(',').map((funcion, index) => (
                <li  key={index}>+ {funcion.trim()} </li> 
            ));
            return <ul> {funcionesList}</ul>;
        } else {
            // Renderizar directamente como texto
            return <p>{oferta.funciones}</p>;
        }
    };
    const renderDetalles = () => {
        if (!oferta.detalles_adicionales) return null;

        // Verificar si hay comas en funciones
        if (oferta.detalles_adicionales.includes(',')) {
            // Dividir las funciones por comas y renderizar como lista con viñetas
            const detallesList = oferta.detalles_adicionales.split(',').map((detalle, index) => (
                <li  key={index}>+ {detalle.trim()} </li> 
            ));
            return <ul> {detallesList}</ul>;
        } else {
            // Renderizar directamente como texto
            return <p>{oferta.detalles_adicionales}</p>;
        }
    };

    const renderValorCriterioE = (criterio: Criterio) => {
        switch (criterio.pivot.valor) {
            case 'Joven':
                return '18 - 25 años';
            case 'Adulto':
                return '26 - 35 años';
            case 'Mayor':
                return '36 años en adelante';
            default:
                return criterio.pivot.valor;
        }
    };

    const renderCriterioValor = (criterio: Criterio) => {
        if (criterio.criterio === 'Idioma') {
            const idiomaId = Number(criterio.pivot.valor);
            console.log(idiomaId);
            return idiomas[idiomaId]  || criterio.pivot.valor;
        }
        if (criterio.criterio === 'Edad') {
            return renderValorCriterioE(criterio);
        }
        return criterio.pivot.valor;
    };


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-11/12 md:w-1/2 text-center overflow-auto max-h-screen md:max-h-96"
                style={{ maxHeight: `calc(100vh - 30px)` }}>
               <button onClick={onClose} className="text-white bg-red-500 rounded-full w-8 h-8 absolute top-4 right-4 z-50 flex items-center justify-center">X</button>
                <h2 className="text-xl font-bold mb-4">{oferta.cargo}</h2>
                <div className="flex justify-center items-center mb-4">
                    <img
                        src={oferta.mostrar_empresa === 1 ? '/images/anonima.png' : `http://localhost:8000/storage/${oferta.empresa.logo}`}
                        alt="Logo"
                        className="w-20 h-16 shadow-lg"
                    />
                </div>
                <div className="text-center">
                    <div>
                        <p className="text-gray-700 mb-1"><strong>Título/s solicitados:</strong></p>
                        <ul>
                            {oferta.expe.map((titulo, index) => (
                                <li key={index}>
                                    <p>• {titulo.titulo}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-gray-700 mb-1"><strong>Empresa:</strong> {oferta.mostrar_empresa === 1 ? 'Anónima' : oferta.empresa.nombre_comercial}</p>
                    <p className="text-gray-700 mb-1"><strong>Sueldo:</strong>{oferta.mostrar_sueldo === 1 ? 'No descrito' : oferta.sueldo}</p>
                    <p className="text-gray-700 mb-1"><strong>Experiencia en cargos similares:</strong> {oferta.experiencia} años</p>
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
                        <p className="text-gray-700 mb-1"><strong>Requisitos adicionales:</strong></p>
                        <ul>
                            {oferta.criterios.map((criterio, index) => (
                                <li key={index}>
                                    <p><strong>⁃ {criterio.criterio}:</strong> {renderCriterioValor(criterio)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button onClick={handlePostular} className="mt-4 bg-blue-500 text-white p-2 rounded">Postular</button>
            </div>
        </div>
    );
}
function VerOfertasAll() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [areas, setAreas] = useState<Area[]>([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);

   // Función para formatear fecha
   const formatFechaMaxPos = (fecha: string) => {
    const date = new Date(fecha);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
};
    useEffect(() => {
        fetchOfertas();
        fetchAreas();
        
    }, []);

    const fetchAreas = async () => {
        try {
            const response = await axios.get(`areas`); // Reemplaza con tu URL para obtener las áreas
            setAreas(response.data.areas);
        } catch (error) {
            console.error('Error fetching areas:', error);
        }
    };

    const fetchOfertas = async () => {
        try {
            const response = await axios.get(`ofertas`); // Reemplaza con tu URL y ID de empresa
            setOfertas(response.data.ofertas);
        } catch (error) {
            console.error('Error fetching ofertas:', error);
        }
    };

   
    const filteredOfertas = ofertas.filter((oferta) =>
        oferta.cargo.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedArea === '' || oferta.areas.nombre_area === selectedArea)
    );

    return (
        <div className="w-full p-4">
            <div className="flex mb-4">
                <input
                    type="text"
                    className="border border-gray-300 p-2 rounded mr-2"
                    placeholder="Buscar por cargo"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                >
                    {showAdvancedSearch ? 'Ocultar Búsqueda Avanzada' : 'Búsqueda Avanzada'}
                </button>
            </div>

            {showAdvancedSearch && (
                <div className="mb-4 p-4 border border-gray-300 rounded">
                    <h2 className="text-xl font-semibold mb-4">Búsqueda Avanzada</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" className="border border-gray-300 p-2 rounded" placeholder="Buscar por empresa" />
                        <select
                            className="border border-gray-300 p-2 rounded"
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                        >
                            <option value="">Seleccione un área</option>
                            {areas.map(area => (
                                <option key={area.id} value={area.nombre_area}>
                                    {area.nombre_area}
                                </option>
                            ))}
                        </select>
                        {/* Agrega más inputs según sea necesario */}
                    </div>
                </div>
            )}
            <h1 className="text-2xl font-semibold mb-4">OFERTAS PUBLICADAS:</h1>
            <div className="relative overflow-x-auto">
            <div className="flex flex-wrap gap-4">
    {filteredOfertas.map((oferta) => (
        <div key={oferta.id_oferta} className="bg-gray-100 p-4 rounded shadow-md flex-shrink-0 w-full md:w-1/2 lg:w-3/4">
            <div className="flex items-center justify-center mb-2"> {/* Alineación vertical y horizontal centrada */}
                <img
                    src={oferta.mostrar_empresa === 1 ? '/images/anonima.png' : `http://localhost:8000/storage/${oferta.empresa.logo}`}
                    alt="Logo"
                    className="w-20 h-16 rounded-full shadow-lg mr-4"
                />
                <div className="text-center"> {/* Contenedor para centrar el título */}
                    <h2 className="text-xl font-bold">{oferta.cargo}</h2>
                </div>
            </div>
            <p className="text-gray-700 mb-1"><strong>Empresa:</strong> {oferta.mostrar_empresa === 1 ? 'Anónima' : oferta.empresa.nombre_comercial}</p>
            <p className="text-gray-700 mb-1"><strong>Área:</strong> {oferta.areas.nombre_area.charAt(0).toUpperCase() + oferta.areas.nombre_area.slice(1).toLowerCase()}</p>
            <p className="text-gray-700 mb-1"><strong>Carga Horaria:</strong> {oferta.carga_horaria}</p>
            <p className="text-gray-700 mb-1"><strong>Fecha Máxima De Postulación:</strong> {formatFechaMaxPos(oferta.fecha_max_pos)}</p>
            <button onClick={() => setSelectedOferta(oferta)} className="text-blue-600 hover:underline">Ver Oferta</button>
        </div>
    ))}
</div>


            </div>
            {selectedOferta && <Modal oferta={selectedOferta} onClose={() => setSelectedOferta(null)} userId={user?.id} />}
        </div>
    );
}

export default VerOfertasAll;
