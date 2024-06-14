import React, { useState, useEffect } from 'react';
import axios from '../../services/axios';

const EmpresaDetails: React.FC = () => {
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Empresa>('http://localhost:8000/api/empresaById/1');
                setEmpresa(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    if (!empresa) {
        return <div className="flex justify-center items-center h-screen">No company data available</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white text-black rounded-lg shadow-md" style={{ borderColor: '#d1552a', borderWidth: '4px' }}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left mr-0 sm:mr-8">
                    <h1 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 inline-block pb-2 w-40 text-center text-black">{empresa.nombre_comercial}</h1>
                    <img src={`http://localhost:8000/${empresa.logo}`} alt="Logo" className="w-32 h-32 object-cover border-2 border-black rounded-full mb-4 sm:mb-0 mx-auto" />
                </div>
                <div className="w-full">
                    <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 inline-block pb-2 w-40 text-black">Detalles del Perfil</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black">
                        <p><strong>Provincia:</strong> {empresa.ubicacion.provincia}</p>
                        <p><strong>Cantón:</strong> {empresa.ubicacion.canton}</p>
                        <p><strong>Sector:</strong> {empresa.sector.sector}</p>
                        <p><strong>División:</strong> {empresa.sector.division}</p>
                        <p><strong>Tamaño:</strong> {empresa.tamanio}</p>
                        <p><strong>Descripción:</strong> {empresa.descripcion}</p>
                        <p><strong>Cantidad de Empleados:</strong> {empresa.cantidad_empleados}</p>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 inline-block pb-2 w-40 text-black">Redes Sociales</h2>
                        <ul className="list-disc list-inside">
                            {empresa.red.map((red) => (
                                <li key={red.id_empresa_red}>
                                    <a href={red.enlace} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-d1552a">
                                        {red.nombre_red}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpresaDetails;
