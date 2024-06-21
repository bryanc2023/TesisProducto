import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Estadisticas: React.FC = () => {
    const barData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
            {
                label: 'Ofertas Publicadas',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const lineData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
            {
                label: 'Usuarios Registrados',
                data: [65, 59, 80, 81, 56, 55],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    };

    const pieData = {
        labels: ['Activos', 'Inactivos', 'Suspendidos'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

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
                <h3 className="text-xl font-semibold mb-2">Estado de los Usuarios</h3>
                <Pie data={pieData} />
            </div>
        </div>
    );
};

export default Estadisticas;
