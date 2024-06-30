import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import axios from '../../services/axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Estadisticas: React.FC = () => {
    const [barData, setBarData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Ofertas Publicadas',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    const [lineData, setLineData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Usuarios Registrados',
                data: [],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    });

    const [horizontalBarData, setHorizontalBarData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Postulaciones Realizadas',
                data: [],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    });

    const [summary, setSummary] = useState({
        totalOfertas: 0,
        totalUsuarios: 0,
        totalPostulaciones: 0,
        detallesOfertas: [],
        detallesUsuarios: [],
        detallesPostulaciones: []
    });

    useEffect(() => {
        const fetchOfertasPorMes = async () => {
            try {
                const response = await axios.get('/ofertas-por-mes?id_empresa=1'); // Cambia el id_empresa por el que necesites
                const ofertas = response.data;

                const labels = ofertas.map(oferta => `${oferta.month}/${oferta.year}`);
                const data = ofertas.map(oferta => oferta.total);
                const totalOfertas = data.reduce((acc, curr) => acc + curr, 0);

                setBarData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Ofertas Publicadas',
                            data: data,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                });

                setSummary(prev => ({ ...prev, totalOfertas, detallesOfertas: ofertas }));
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        const fetchUsuariosRegistradosPorMes = async () => {
            try {
                const response = await axios.get('/usuarios-registrados-por-mes');
                const usuarios = response.data;

                const labels = usuarios.map(usuario => `${usuario.month}/${usuario.year}`);
                const data = usuarios.map(usuario => usuario.total);
                const totalUsuarios = data.reduce((acc, curr) => acc + curr, 0);

                setLineData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Usuarios Registrados',
                            data: data,
                            fill: false,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                        },
                    ],
                });

                setSummary(prev => ({ ...prev, totalUsuarios, detallesUsuarios: usuarios }));
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        const fetchPostulacionesPorMes = async () => {
            try {
                const response = await axios.get('/postulaciones-por-mes');
                const postulaciones = response.data;

                const labels = postulaciones.map(postulacion => `${postulacion.month}/${postulacion.year}`);
                const data = postulaciones.map(postulacion => postulacion.total);
                const totalPostulaciones = data.reduce((acc, curr) => acc + curr, 0);

                setHorizontalBarData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Postulaciones Realizadas',
                            data: data,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                        },
                    ],
                });

                setSummary(prev => ({ ...prev, totalPostulaciones, detallesPostulaciones: postulaciones }));
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchOfertasPorMes();
        fetchUsuariosRegistradosPorMes();
        fetchPostulacionesPorMes();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Estadísticas de la App de Gestión de Ofertas de Trabajo</h2>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Ofertas Publicadas por Mes</h3>
                <Bar data={barData} />
            </div>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Usuarios Registrados por Mes</h3>
                <Line data={lineData} />
            </div>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Postulaciones Realizadas por Mes</h3>
                <Bar data={horizontalBarData} options={{ indexAxis: 'y' }} />
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Resumen</h3>
                <p><strong>Total de Ofertas Publicadas:</strong> {summary.totalOfertas}</p>
                <p><strong>Total de Usuarios Registrados:</strong> {summary.totalUsuarios}</p>
                <p><strong>Total de Postulaciones Realizadas:</strong> {summary.totalPostulaciones}</p>
                <table className="min-w-full bg-white border border-gray-200 mt-4">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Mes/Año</th>
                            <th className="px-4 py-2 border-b">Total Ofertas</th>
                            <th className="px-4 py-2 border-b">Total Usuarios</th>
                            <th className="px-4 py-2 border-b">Total Postulaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summary.detallesOfertas.map((oferta, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{`${oferta.month}/${oferta.year}`}</td>
                                <td className="border px-4 py-2">{oferta.total}</td>
                                <td className="border px-4 py-2">{summary.detallesUsuarios[index] ? summary.detallesUsuarios[index].total : 'N/A'}</td>
                                <td className="border px-4 py-2">{summary.detallesPostulaciones[index] ? summary.detallesPostulaciones[index].total : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Estadisticas;
