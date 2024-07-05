import React, { useState, useEffect } from 'react';
import { FaEye, FaDownload } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../../services/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Modal from 'react-modal';

interface ReportData {
  id: number;
  name: string;
  email: string;
  vigencia: string;
  created_at: string;
  num_postulaciones?: number;
  detalles_postulaciones?: {
    cargo: string;
  }[];
  empresa?: {
    nombre_comercial: string;
    ofertas: {
      id_oferta: number;
      cargo: string;
      experiencia: string;
      fecha_publi: string;
      num_postulantes: number;
    }[];
  };
}

const Reportes: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reportType, setReportType] = useState('postulantes');
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [useFilters, setUseFilters] = useState<boolean>(false);

  const fetchData = async () => {
    if (useFilters && (!startDate || !endDate || startDate > endDate)) {
      setError('Por favor, selecciona fechas válidas.');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`/usuarios/${reportType}`, {
        params: useFilters ? {
          startDate: startDate?.toISOString().split('T')[0],
          endDate: endDate?.toISOString().split('T')[0],
        } : {},
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
    fetchData();
  }, [startDate, endDate, reportType]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Proajob', 14, 16);
    doc.setFontSize(10);
    doc.text(`Reporte de ${reportType}`, 14, 22);

    const tableColumn = ["Nombre", "Correo", "Fecha de Creación"];
    if (reportType === 'postulantes') {
      tableColumn.push("Número de Postulaciones", "Postulaciones", "Vigencia");
    } else if (reportType === 'empresas') {
      tableColumn.push("Empresa", "Ofertas Publicadas");
    }

    const tableRows: any[] = [];

    data.forEach(item => {
      const itemData = [
        item.name,
        item.email,
        item.created_at
      ];
      if (reportType === 'postulantes') {
        itemData.push(item.num_postulaciones, item.detalles_postulaciones?.map(detalle => detalle.cargo).join(', '), item.vigencia);
      } else if (reportType === 'empresas' && item.empresa) {
        itemData.push(item.empresa.nombre_comercial, item.empresa.ofertas.map(oferta => `${oferta.cargo} (Postulantes: ${oferta.num_postulantes})`).join(', '));
      }
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

  const previewPDF = async () => {
    const doc = new jsPDF();
    doc.text('Proajob', 14, 16);
    doc.setFontSize(10);
    doc.text(`Reporte de ${reportType}`, 14, 22);

    const tableColumn = ["Nombre", "Correo", "Fecha de Creación"];
    if (reportType === 'postulantes') {
      tableColumn.push("Número de Postulaciones", "Postulaciones", "Vigencia");
    } else if (reportType === 'empresas') {
      tableColumn.push("Empresa", "Ofertas Publicadas");
    }

    const tableRows: any[] = [];

    data.forEach(item => {
      const itemData = [
        item.name,
        item.email,
        item.created_at
      ];
      if (reportType === 'postulantes') {
        itemData.push(item.num_postulaciones, item.detalles_postulaciones?.map(detalle => detalle.cargo).join(', '), item.vigencia);
      } else if (reportType === 'empresas' && item.empresa) {
        itemData.push(item.empresa.nombre_comercial, item.empresa.ofertas.map(oferta => `${oferta.cargo} (Postulantes: ${oferta.num_postulantes})`).join(', '));
      }
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
    setIsModalOpen(true);
  };

  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
    setPreviewUrl(null);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setPreviewUrl(null);
    if (date && !endDate) {
      setError('Selecciona la fecha de fin.');
    } else {
      setError(null);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setPreviewUrl(null);
    if (startDate && date && date < startDate) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
    } else {
      setError(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPreviewUrl(null);
  };

  return (
    <div className="mb-4 text-center max-w-screen-lg mx-auto">
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <input
            type="checkbox"
            checked={useFilters}
            onChange={(e) => setUseFilters(e.target.checked)}
            className="mr-2"
          />
          Usar filtros de fecha
        </label>
      </div>
      {useFilters && (
        <>
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
        </>
      )}
      {error && <div className="text-red-500 mb-4">{error}</div>}
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
            {data.length === 0 ? (
              <p className="text-center text-gray-500">
                {reportType === 'postulantes' ? 'No se han encontrado postulantes registrados' : 'No se han encontrado empresas registradas'}
              </p>
            ) : (
              <>
                <div id="reportTable" className="bg-white p-4 rounded-md shadow-md">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="w-2/12 px-4 py-2">Nombre</th>
                        <th className="w-2/12 px-4 py-2">Correo</th>
                        <th className="w-2/12 px-4 py-2">Fecha de Creación</th>
                        {reportType === 'postulantes' && (
                          <>
                            <th className="w-2/12 px-4 py-2">Número de Postulaciones</th>
                            <th className="w-5/12 px-4 py-2">Postulaciones</th>
                            <th className="w-2/12 px-4 py-2">Vigencia</th>
                          </>
                        )}
                        {reportType === 'empresas' && (
                          <>
                            <th className="w-2/12 px-4 py-2">Empresa</th>
                            <th className="w-4/12 px-4 py-2">Ofertas Publicadas</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item) => (
                        <tr key={item.id}>
                          <td className="border px-4 py-2">{item.name}</td>
                          <td className="border px-4 py-2">{item.email}</td>
                          <td className="border px-4 py-2">{item.created_at}</td>
                          {reportType === 'postulantes' && (
                            <>
                              <td className="border px-4 py-2">{item.num_postulaciones}</td>
                              <td className="border px-4 py-2">{item.detalles_postulaciones?.map(detalle => detalle.cargo).join(', ')}</td>
                              <td className="border px-4 py-2">{item.vigencia}</td>
                            </>
                          )}
                          {reportType === 'empresas' && item.empresa && (
                            <>
                              <td className="border px-4 py-2">{item.empresa.nombre_comercial}</td>
                              <td className="border px-4 py-2">{item.empresa.ofertas.map(oferta => `${oferta.cargo} (Postulantes: ${oferta.num_postulantes})`).join(', ')}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
              </>
            )}
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              contentLabel="Vista previa del PDF"
              className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto my-20 relative overflow-y-auto z-50"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
            >
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">Vista previa del reporte PDF</h3>
              {previewUrl && (
                <iframe src={previewUrl} width="100%" height="500px" style={{ border: 'none', minHeight: '300px' }}></iframe>
              )}
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default Reportes;
