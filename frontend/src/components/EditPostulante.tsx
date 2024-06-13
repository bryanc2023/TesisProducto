import React, { useState } from 'react';
import Modal from 'react-modal';

interface EditPostulanteModalProps {
  isOpen: boolean;
  closeModal: () => void;
  postulante: {
    foto: string;
    nombres: string;
    apellidos: string;
    fecha_nac: string;
    edad: number;
    estado_civil: string;
    cedula: string;
    genero: string;
    informacion_extra: string;
  };
}

const EditPostulanteModal: React.FC<EditPostulanteModalProps> = ({ isOpen, closeModal, postulante }) => {
  const [nombres, setNombres] = useState(postulante.nombres);
  const [apellidos, setApellidos] = useState(postulante.apellidos);
  const [fecha_nac, setFechaNac] = useState(postulante.fecha_nac);
  const [estado_civil, setEstadoCivil] = useState(postulante.estado_civil);
  const [genero, setGenero] = useState(postulante.genero);
  const [informacion_extra, setInformacionExtra] = useState(postulante.informacion_extra);

  const handleSave = () => {
    // Lógica para guardar los cambios
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Editar Datos del Postulante"
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto my-20 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
        &times;
      </button>
      <h2 className="text-2xl text-center font-semibold mb-4 text-blue-500">Editar Datos</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Nombres</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700">Apellidos</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700">Fecha de Nacimiento</label>
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-md"
            value={fecha_nac}
            onChange={(e) => setFechaNac(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700">Estado Civil</label>
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={estado_civil}
            onChange={(e) => setEstadoCivil(e.target.value)}
          >
            <option value="soltero">Soltero</option>
            <option value="casado">Casado</option>
            <option value="divorciado">Divorciado</option>
            <option value="viudo">Viudo</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Género</label>
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Información Extra</label>
          <textarea
            className="w-full px-4 py-2 border rounded-md"
            rows={3}
            value={informacion_extra}
            onChange={(e) => setInformacionExtra(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={closeModal} className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white">Cancelar</button>
          <button type="button" onClick={handleSave} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">Guardar</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditPostulanteModal;
