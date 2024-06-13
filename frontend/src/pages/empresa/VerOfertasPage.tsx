import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { RootState } from '../../store';
import { useSelector } from 'react-redux';


interface Oferta {
    id_oferta: number;
    estado: string;
    cargo:string;
    areas: {
        nombre_area: string;
    };
    fecha_publi:string;
    modalidad:string;
    carga_horaria:string;
    experiencia:string;
    mostrar_empresa:number;
    // Define otros campos de la oferta según sea necesario
}

function VerOfertasPPage() {
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        fetchOfertas();
    }, []);

    const fetchOfertas = async () => {
        if(user){
        try {
            const response = await axios.get(`empresa/${user.id}/ofertas`); // Reemplaza con tu URL y ID de empresa
            setOfertas(response.data.ofertas);
        } catch (error) {
            console.error('Error fetching ofertas:', error);
        }
    }
    };

    return (
        <div className="w-full p-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <h1 className="text-2xl font-semibold mb-4">OFERTAS PUBLICADAS:</h1>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="py-3 px-6">Cargo</th>
                            <th scope="col" className="py-3 px-6">Estado</th>
                            <th scope="col" className="py-3 px-6">Fecha Publicacion</th>
                            <th scope="col" className="py-3 px-6">Área</th>
                            <th scope="col" className="py-3 px-6">Carga Horaria</th>
                            <th scope="col" className="py-3 px-6">Experiencia Mínima</th>
                            <th scope="col" className="py-3 px-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ofertas.map((oferta) => (
                            <tr key={oferta.id_oferta}>
                                <td className="py-4 px-6">{oferta.cargo}</td>
                                <td className="py-4 px-6">{oferta.estado}</td>
                                <td className="py-4 px-6">{oferta.fecha_publi}</td>
                                <td className="py-4 px-6">{oferta.areas.nombre_area}</td>
                                <td className="py-4 px-6">{oferta.carga_horaria}</td>
                                <td className="py-4 px-6">{oferta.experiencia}</td>
                                {/* Agrega los demás campos según tus necesidades */}
                          
                                <td className="py-4 px-6">
                                    <Link to={`/postulantes/${oferta.id_oferta}`} className="text-blue-600 hover:underline">Ver Oferta</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <Link to="/add-oferta" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Agregar Nueva Oferta</Link>
            </div>
        </div>
    );
}

export default VerOfertasPPage;