import React, { useState } from 'react';

interface Criterio {
  nombre: string;
  descripcion: string;
  peso: number;
}

const CatalogoRegistro: React.FC = () => {
  const [criterios, setCriterios] = useState<Criterio[]>([]);
  const [nuevoCriterio, setNuevoCriterio] = useState<Criterio>({
    nombre: '',
    descripcion: '',
    peso: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoCriterio({ ...nuevoCriterio, [name]: value });
  };

  const handlePesoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNuevoCriterio({ ...nuevoCriterio, peso: parseInt(value, 10) });
  };

  const agregarCriterio = () => {
    setCriterios([...criterios, nuevoCriterio]);
    setNuevoCriterio({ nombre: '', descripcion: '', peso: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes enviar los datos al backend
    console.log('Criterios registrados:', criterios);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Registrar Catálogos de Calificación</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Criterio</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={nuevoCriterio.nombre}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción del Criterio</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={nuevoCriterio.descripcion}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="peso" className="block text-sm font-medium text-gray-700">Peso del Criterio</label>
          <input
            type="number"
            id="peso"
            name="peso"
            value={nuevoCriterio.peso}
            onChange={handlePesoChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="button"
          onClick={agregarCriterio}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Agregar Criterio
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md ml-4"
        >
          Registrar Catálogos
        </button>
      </form>
      <h3 className="text-xl font-bold mt-6">Criterios Registrados</h3>
      <ul className="list-disc list-inside">
        {criterios.map((criterio, index) => (
          <li key={index} className="mt-2">
            <strong>{criterio.nombre}</strong> - {criterio.descripcion} (Peso: {criterio.peso})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CatalogoRegistro;
