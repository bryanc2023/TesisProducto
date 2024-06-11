import React, { useState, useEffect } from 'react';

function ResultadosP() {
    const [resultados, setResultados] = useState([]);

    useEffect(() => {
        const fetchResultados = async () => {
            
            
        };

        fetchResultados();
    }, []);

    return (
        <div className="w-full p-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <h1 className="text-2xl font-semibold mb-4">Consulta de Resultados:</h1>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="py-3 px-6">ID</th>
                            <th className="py-3 px-6">Empresa</th>
                            <th className="py-3 px-6">Puesto</th>
                            <th className="py-3 px-6">Estado</th>
                            <th className="py-3 px-6">Comentarios</th>
                        </tr>
                    </thead>
                    <tbody>
                  
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ResultadosP;
