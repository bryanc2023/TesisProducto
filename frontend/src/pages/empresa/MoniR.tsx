import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const COLORS2 = ['#8884d8'];

const RecruitmentDashboard = () => {
    const [postulaciones, setPostulaciones] = useState([]);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchPostulaciones = async () => {
            try {
                const response = await axios.get(`estadistica/${user?.id}`);
                setPostulaciones(response.data.postulaciones);
            } catch (error) {
                console.error('Error fetching postulaciones:', error);
            }
        };

        fetchPostulaciones();
    }, []);

    // Verificar si postulaciones es un array válido antes de mapearlo
    if (!Array.isArray(postulaciones) || postulaciones.length === 0) {
        return (
            <div className="w-full p-4">
                <h1 className="text-2xl font-semibold mb-4">Monitoreo de Reclutamiento</h1>
                <p>No hay datos de postulaciones disponibles.</p>
            </div>
        );
    }

    // Mapear postulaciones solo si es un array válido y tiene elementos
    const data = postulaciones.map((postulacion, index) => ({
        name: `Oferta ${ index + 1}`,
        postulantes: postulacion.num_postulantes,
        cargo: postulacion.cargo,
        number:index + 1, // Contador de oferta comenzando desde 1
        
    }));

    let totalPendientes = 0;
    let totalAprobados = 0;
    let totalRechazados = 0;

    postulaciones.forEach(postulacion => {
        totalPendientes += postulacion.estado_count['P'];
        totalAprobados += postulacion.estado_count['A'];
        totalRechazados += postulacion.estado_count['R'];
    });

    // Datos para el gráfico de pastel
    const pieData = [
        { name: 'Solicitudes Pendientes', value: totalPendientes },
        { name: 'Solicitudes Aprobados', value: totalAprobados },
        { name: 'Solicitudes Rechazados', value: totalRechazados },
    ];

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
                            <Bar dataKey="postulantes" fill="#8884d8">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4">
                        <ul>
                            {data.map((entry, index) => (
                                <li key={`legend-${index}`} className="flex items-center">
                                    <div className={`h-4 w-4 mr-2 rounded-full ${COLORS[index % COLORS.length]}`}></div>
                                    <span>{`Oferta ${entry.number} = ${entry.cargo}`}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Estado de postulaciones</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
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
