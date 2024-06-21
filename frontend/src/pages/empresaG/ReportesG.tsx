import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const ReportDocument = ({ data, title }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {data.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{item.email}</Text>
            {/* Agrega más campos según sea necesario */}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const Reportes: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reportType, setReportType] = useState('postulantes');
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/${reportType}`, {
        params: {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, reportType]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Generar Reportes</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
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
          onChange={(date) => setStartDate(date)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          dateFormat="yyyy/MM/dd"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
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
        {data.length > 0 && (
          <PDFDownloadLink
            document={<ReportDocument data={data} title={`Reporte de ${reportType}`} />}
            fileName={`${reportType}_report.pdf`}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Descargar PDF
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
};

export default Reportes;
