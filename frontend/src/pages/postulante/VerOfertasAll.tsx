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
        nombre_area: string;
    };
    empresa: {
        id_empresa: string,
        nombre_comercial: string;
        logo: string;
    };
    fecha_publi: string;
    mostrar_empresa: number;
    modalidad: string;
    carga_horaria: string;
    experiencia: string;
    // Define otros campos de la oferta según sea necesario
}

interface ModalProps {
    oferta: Oferta | null;
    onClose: () => void;
    userId: number| undefined;
}

function Modal({ oferta, onClose, userId }: ModalProps) {
    const navigate = useNavigate();
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


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg w-11/12 md:w-1/2">
                <button onClick={onClose} className="text-red-500 float-right">X</button>
                <h2 className="text-xl font-semibold">{oferta.cargo}</h2>
                <img
                    src={oferta.mostrar_empresa === 1 ? 'https://guiadelempresario.com/wp-content/uploads/2021/04/Copy-of-Untitled-500x500.png' : `http://localhost:8000/storage/${oferta.empresa.logo}`}
                    alt="Logo"
                    className="w-20 h-16 rounded-full shadow-lg mr-4"
                />
                <p className="text-gray-700 mb-1"><strong>Empresa:</strong> {oferta.mostrar_empresa === 1 ? 'Anónima' : oferta.empresa.nombre_comercial}</p>
                <p className="text-gray-700 mb-1"><strong>Fecha Publicación:</strong> {oferta.fecha_publi}</p>
                <p className="text-gray-700 mb-1"><strong>Área:</strong> {oferta.areas.nombre_area}</p>
                <p className="text-gray-700 mb-1"><strong>Carga Horaria:</strong> {oferta.carga_horaria}</p>
                <p className="text-gray-700 mb-1"><strong>Experiencia Mínima:</strong> {oferta.experiencia}</p>
                <p className="text-gray-700 mb-1"><strong>Objetivo del cargo:</strong> {oferta.objetivo_cargo}</p>
                <p className="text-gray-700 mb-1"><strong>Funciones:</strong> {oferta.funciones}</p>
                <p className="text-gray-700 mb-1"><strong>Detalles adicionales:</strong> {oferta.detalles_adicionales}</p>
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
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);


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
                            <div className="flex items-center mb-2">
                                <img
                                    src={oferta.mostrar_empresa === 1 ? 'https://guiadelempresario.com/wp-content/uploads/2021/04/Copy-of-Untitled-500x500.png' : `http://localhost:8000/storage/${oferta.empresa.logo}`}
                                    alt="Logo"
                                    className="w-20 h-16 rounded-full shadow-lg mr-4"
                                />
                                <h2 className="text-xl font-semibold">{oferta.cargo}</h2>
                            </div>
                            <p className="text-gray-700 mb-1"><strong>Empresa:</strong> {oferta.mostrar_empresa === 1 ? 'Anónima' : oferta.empresa.nombre_comercial}</p>
                            <p className="text-gray-700 mb-1"><strong>Fecha Publicación:</strong> {oferta.fecha_publi}</p>
                            <p className="text-gray-700 mb-1"><strong>Área:</strong> {oferta.areas.nombre_area}</p>
                            <p className="text-gray-700 mb-1"><strong>Carga Horaria:</strong> {oferta.carga_horaria}</p>
                            <p className="text-gray-700 mb-1"><strong>Experiencia Mínima:</strong> {oferta.experiencia}</p>
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
