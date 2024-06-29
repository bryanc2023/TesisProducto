import React from 'react';
import * as XLSX from 'xlsx';
import { useLocation, useNavigate } from 'react-router-dom';

const VistaPreviaArchivo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fileData, fileName } = location.state || {};

    const renderPreview = (data: string) => {
        const parsedData = JSON.parse(data);
        return (
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        {parsedData[0].map((header: string, index: number) => (
                            <th key={index} className="px-4 py-2 border">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {parsedData.slice(1).map((row: any, rowIndex: number) => (
                        <tr key={rowIndex}>
                            {row.map((cell: any, cellIndex: number) => (
                                <td key={cellIndex} className="px-4 py-2 border">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Vista Previa de {fileName}</h1>
            {fileData ? (
                renderPreview(fileData)
            ) : (
                <p>No hay datos para mostrar.</p>
            )}
            <button
                onClick={() => navigate(-1)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Regresar
            </button>
        </div>
    );
};

export default VistaPreviaArchivo;
