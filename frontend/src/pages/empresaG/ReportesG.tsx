import React, { useState, useEffect } from 'react';
import { FaEye, FaDownload } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../../services/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportData {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const Reportes: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reportType, setReportType] = useState('postulantes');
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/usuarios/${reportType}`, {
        params: {
          startDate: startDate?.toISOString().split('T')[0],
          endDate: endDate?.toISOString().split('T')[0],
        },
      });
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Error al obtener los datos del reporte');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, reportType]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Proajob', 14, 16);
    doc.setFontSize(10);
    doc.text(`Reporte de ${reportType}`, 14, 22);

    const tableColumn = ["ID", "Nombre", "Correo", "Fecha de Creación"];
    const tableRows: any[] = [];

    data.forEach(item => {
      const itemData = [
        item.id,
        item.name,
        item.email,
        item.created_at
      ];
      tableRows.push(itemData);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }
    });

    doc.save('reporte.pdf');
  };

  const previewPDF = () => {
    const doc = new jsPDF();
    doc.text('Proajob', 14, 16);
    doc.setFontSize(10);
    doc.text(`Reporte de ${reportType}`, 14, 22);

    const tableColumn = ["ID", "Nombre", "Correo", "Fecha de Creación"];
    const tableRows: any[] = [];

    data.forEach(item => {
      const itemData = [
        item.id,
        item.name,
        item.email,
        item.created_at
      ];
      tableRows.push(itemData);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }
    });

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    setPreviewUrl(url);
  };

  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
    setPreviewUrl(null);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setPreviewUrl(null);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setPreviewUrl(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Generar Reportes</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
        <select
          value={reportType}
          onChange={handleReportTypeChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="postulantes">Postulantes</option>
          <option value="empresas">Empresas</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          dateFormat="yyyy/MM/dd"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          dateFormat="yyyy/MM/dd"
        />
      </div>
      <div className="mb-4">
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Generar Reporte
        </button>
      </div>
      <div>
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            {data.length > 0 && (
              <div id="reportTable" className="bg-white p-4 rounded-md shadow-md">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="w-1/4 px-4 py-2">ID</th>
                      <th className="w-1/4 px-4 py-2">Nombre</th>
                      <th className="w-1/2 px-4 py-2">Correo</th>
                      <th className="w-1/4 px-4 py-2">Fecha de Creación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id}>
                        <td className="border px-4 py-2">{item.id}</td>
                        <td className="border px-4 py-2">{item.name}</td>
                        <td className="border px-4 py-2">{item.email}</td>
                        <td className="border px-4 py-2">{item.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={generatePDF}
                className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <FaDownload className="w-4 h-4" />
              </button>
              {data.length > 0 && (
                <button
                  onClick={previewPDF}
                  className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <FaEye className="w-4 h-4" />
                </button>
              )}
            </div>
            {previewUrl && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Vista previa del reporte PDF</h3>
                <iframe src={previewUrl} width="100%" height="500px" style={{ border: 'none' }}></iframe>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reportes;
