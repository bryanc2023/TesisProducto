import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FiMonitor } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const COLORS2 = ['#8884d8'];

const RecruitmentDashboard = () => {
    const [postulaciones, setPostulaciones] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const { user } = useSelector((state: RootState) => state.auth);
    const [showCharts, setShowCharts] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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
    }, [user]);

    useEffect(() => {
        // Filtrar y agrupar datos por mes
        const filtered = postulaciones.filter(postulacion => 
            new Date(postulacion.fecha).getFullYear() === selectedYear
        );

        const groupedData = filtered.reduce((acc, curr) => {
            const month = format(parseISO(curr.fecha), 'MMM');
            if (!acc[month]) {
                acc[month] = { month, postulantes: 0 };
            }
            acc[month].postulantes += curr.num_postulantes;
            return acc;
        }, {});

        setFilteredData(Object.values(groupedData));
    }, [postulaciones, selectedYear]);

    // Verificar si postulaciones es un array válido antes de mapearlo
    if (!Array.isArray(postulaciones) || postulaciones.length === 0) {
        return (
            <div className="w-full p-4">
                <h1 className="text-3xl font-bold mb-4 flex justify-center items-center text-orange-500 ml-2">
                    Monitoreo del proceso de reclutamiento
                    <FiMonitor className="text-orange-500 ml-2" />
                </h1>
                <p>No hay datos de postulaciones disponibles.</p>
            </div>
        );
    }

    // Mapear postulaciones solo si es un array válido y tiene elementos
    const data = postulaciones.map((postulacion, index) => ({
        name: `Oferta ${index + 1}`,
        postulantes: postulacion.num_postulantes,
        cargo: postulacion.cargo,
        number: index + 1, // Contador de oferta comenzando desde 1
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

    // Datos para el gráfico de líneas (evolución temporal)
    const lineData = postulaciones.map((postulacion, index) => ({
        fecha: postulacion.fecha, // Asumiendo que hay una propiedad "fecha"
        postulantes: postulacion.num_postulantes,
    }));

    // Función para manejar el filtro por fecha
    const handleFilterByDate = async () => {
        try {
            const response = await axios.get(`estadistica/${user?.id}`, {
                params: {
                    fechaInicio,
                    fechaFin,
                },
            });
            setPostulaciones(response.data.postulaciones);
            setShowCharts(true); // Mostrar gráficos después de aplicar el filtro
        } catch (error) {
            console.error('Error filtering postulaciones by date:', error);
        }
    };
    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value, 10));
    };

    return (
        <div className="mb-4 text-center max-w-screen-lg mx-auto">
            <h1 className="text-3xl font-bold mb-4 flex justify-center items-center text-orange-500 ml-2">
                Monitoreo del proceso de reclutamiento
                <FiMonitor className="text-orange-500 ml-2" />
            </h1>
            <p>En esta sección te mostramos a manera estadística el proceso de tus ofertas publicadas</p>
          
              {/* Filtro de Año */}
              <hr className="my-4" />
              <p>Puedes seleccionar un año para visualizar los postulantes por meses de dicho año:</p>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="yearSelect">Seleccione el Año:</label>
                <select
                    id="yearSelect"
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="block w-full p-2 border rounded"
                >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

          
            {filteredData.length > 0 ? (
                <div className="bg-white p-4 rounded shadow mb-4">
                    <h2 className="text-xl font-semibold mb-4">Evolución de Postulaciones</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={filteredData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="postulantes" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="bg-white p-4 rounded shadow mb-4">
                    <h2 className="text-xl font-semibold mb-4">Evolución de Postulaciones</h2>
                    <p>No hay datos de postulaciones disponibles para el año seleccionado.</p>
                </div>
            )}
              <hr className="my-4" />
            {/* Tarjeta para el filtro por fecha */}
            <p>En esta sección puedes visualizar más a detalle las postulaciones y las ofertas según fechas indicadas:</p>
            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="text-xl font-semibold mb-4">Filtrado por Fecha</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label htmlFor="fechaInicio" className="block text-sm font-bold mb-2 text-blue-500">Fecha de Inicio:</label>
                        <input
                            type="date"
                            id="fechaInicio"
                            className="px-2 py-1 border border-gray-300 rounded"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fechaFin" className="block text-sm font-bold mb-2 text-blue-500">Fecha de Fin:</label>
                        <input
                            type="date"
                            id="fechaFin"
                            className="px-2 py-1 border border-gray-300 rounded"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex justify-center items-center">
                        <button
                            onClick={handleFilterByDate}
                            className="bg-blue-500 text-white p-2 rounded-lg"
                        >
                            Filtrar
                        </button>
                    </div>
                </div>
            </div>

            {/* Mostrar gráficos solo si showCharts es true */}
            {showCharts && (
                <>
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
                <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Detalle de Postulaciones</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Oferta</th>
                                <th className="py-2 px-4 border-b">Cargo</th>
                                <th className="py-2 px-4 border-b">Número de Postulantes</th>
                                <th className="py-2 px-4 border-b">Pendientes</th>
                                <th className="py-2 px-4 border-b">Rechazados</th>
                            </tr>
                        </thead>
                        <tbody>
                            {postulaciones.map((postulacion, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">{`Oferta ${index + 1}`}</td>
                                    <td className="py-2 px-4 border-b">{postulacion.cargo}</td>
                                    <td className="py-2 px-4 border-b">{postulacion.num_postulantes}</td>
                                    <td className="py-2 px-4 border-b">{postulacion.estado_count['P']}</td>
                                    <td className="py-2 px-4 border-b">{postulacion.estado_count['R']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </>
                
            )}

        

            
        </div>
    );
};

export default RecruitmentDashboard;
