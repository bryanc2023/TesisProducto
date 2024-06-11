import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Oferta 1', postulantes: 30 },
    { name: 'Oferta 2', postulantes: 20 },
    { name: 'Oferta 3', postulantes: 50 },
    { name: 'Oferta 4', postulantes: 80 },
    { name: 'Oferta 5', postulantes: 45 },
];

const pieData = [
    { name: 'Contratados', value: 10 },
    { name: 'Rechazados', value: 40 },
    { name: 'Pendientes', value: 50 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const RecruitmentDashboard = () => {
    return (
        <div className="w-full p-4">
            <h1 className="text-2xl font-semibold mb-4">Monitoreo de Reclutamiento</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Número de Postulantes por Oferta</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="postulantes" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Estado de las Aplicaciones</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentDashboard;
