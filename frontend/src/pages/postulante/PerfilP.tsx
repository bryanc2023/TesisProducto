import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Modal from 'react-modal';
import Tabs from './../../components/Postulante/Tabs';
import EditPostulanteModal from '../../components/EditPostulante';
import FormacionPEditar from '../../components/FormacionPEditar';
import EditCurso from '../../components/Postulante/EditCurso';
import AddRedModal from '../../components/Postulante/AddRedModal';
import AddIdiomaModal from '../../components/Postulante/AddIdiomaModal'; // Importa el modal
import { FaLinkedin, FaFacebook, FaInstagram, FaXTwitter, FaGlobe } from 'react-icons/fa6'; // Importar íconos
import jsPDF from 'jspdf';

Modal.setAppElement('#root');

const Profile: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<string>('');
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedFormacion, setSelectedFormacion] = useState<Formacion | null>(null);
    const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
    const [cedulaError, setCedulaError] = useState<string | null>(null);
    const [isAddRedModalOpen, setIsAddRedModalOpen] = useState<boolean>(false); // Estado para el modal de agregar red
    const [isAddIdiomaModalOpen, setIsAddIdiomaModalOpen] = useState<boolean>(false); // Estado para el modal de agregar idioma
    const [redes, setRedes] = useState<any[]>([]); // Estado para las redes sociales
    const [languages, setLanguages] = useState<{ id: number; nombre: string }[]>([]); // Estado para los idiomas

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                if (user) {
                    const response = await axios.get(`/perfil/${user.id}`);
                    const data = response.data;
                    if (!data.cursos) {
                        data.cursos = [];
                    }
                    if (!data.experiencia) {
                        data.experiencia = [];
                    }
                    if (!data.idiomas) {
                        data.idiomas = [];
                    }
                    setProfileData(data);
                    if (!isCedulaValid(data.postulante.cedula)) {
                        setCedulaError('Cédula inválida');
                    } else {
                        setCedulaError(null);
                    }
                    if (user) {
                        const response = await axios.get(`/postulante-red/${data.postulante.id_postulante}`);
                        setRedes(response.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            await fetchProfileData();
        };

        fetchData();
    }, [user]);

    const reloadProfile = async () => {
        try {
            if (user) {
                const response = await axios.get(`/perfil/${user.id}`);
                const data = response.data;
                if (!data.cursos) {
                    data.cursos = [];
                }
                if (!data.experiencia) {
                    data.experiencia = [];
                }
                if (!data.idiomas) {
                    data.idiomas = [];
                }
                setProfileData(data);
                const redesResponse = await axios.get(`/postulante-red/${data.postulante.id_postulante}`);
                setRedes(redesResponse.data);
            }
        } catch (error) {
            console.error('Error reloading profile data:', error);
        }
    };

    const isCedulaValid = (cedula: string): boolean => {
        if (cedula.length !== 10) return false;
        const digits = cedula.split('').map(Number);
        const provinceCode = parseInt(cedula.substring(0, 2), 10);
        if (provinceCode < 1 || provinceCode > 24) return false;
        const verifier = digits.pop();
        const sum = digits.reduce((acc, digit, index) => {
            if (index % 2 === 0) {
                const product = digit * 2;
                return acc + (product > 9 ? product - 9 : product);
            } else {
                return acc + digit;
            }
        }, 0);
        const modulus = sum % 10;
        return modulus === 0 ? verifier === 0 : 10 - modulus === verifier;
    };

    const openModal = (content: string) => {
        setModalContent(content);
        setSelectedFormacion(null);
        setSelectedCurso(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent('');
    };

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const openEditFormacionModal = (formacion: Formacion) => {
        setSelectedFormacion(formacion);
        setModalContent('formacion');
        setIsModalOpen(true);
    };

    const openEditCursoModal = (curso: Curso) => {
        setSelectedCurso(curso);
        setModalContent('curso');
        setIsModalOpen(true);
    };

    const openEditLanguageModal = (idioma: Idioma) => {
        setSelectedFormacion(idioma);
        setModalContent('editIdioma');
        setIsModalOpen(true);
    };

    const handleProfileUpdate = (updatedProfile: ProfileData) => {
        setProfileData(updatedProfile);
    };

    const openAddRedModal = () => {
        setIsAddRedModalOpen(true);
    };

    const closeAddRedModal = () => {
        setIsAddRedModalOpen(false);
    };

    const openAddIdiomaModal = () => {
        setIsAddIdiomaModalOpen(true);
    };

    const closeAddIdiomaModal = () => {
        setIsAddIdiomaModalOpen(false);
    };

    const renderIcon = (nombreRed: string) => {
        switch (nombreRed.toLowerCase()) {
            case 'linkedin':
                return <FaLinkedin className="text-blue-700" />;
            case 'facebook':
                return <FaFacebook className="text-blue-600" />;
            case 'x':
                return <FaXTwitter className="text-blue-400" />;
            case 'instagram':
                return <FaInstagram className="text-pink-600" />;
            default:
                return <FaGlobe className="text-gray-400" />;
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        let yOffset = 10; // Offset para manejar el espacio vertical en el PDF

        const addSection = (title: string) => {
            doc.setFontSize(16);
            doc.setTextColor(40, 116, 240);
            doc.text(title, 10, yOffset);
            yOffset += 10;
            doc.setFontSize(12);
            doc.setTextColor(0);
        };

        const addText = (text: string) => {
            doc.text(text, 10, yOffset);
            yOffset += 10;

            // Verificar si es necesario agregar una nueva página
            if (yOffset > 270) {
                doc.addPage();
                yOffset = 10; // Reiniciar el offset en la nueva página
            }
        };

        if (profileData) {
            // Datos del perfil
            doc.setFontSize(18);
            doc.setTextColor(0, 0, 0);
            doc.text(`${profileData.postulante.nombres} ${profileData.postulante.apellidos}`, 10, yOffset);
            yOffset += 10;
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            addText(`Fecha de Nacimiento: ${profileData.postulante.fecha_nac}`);
            addText(`Edad: ${profileData.postulante.edad}`);
            addText(`Estado Civil: ${profileData.postulante.estado_civil}`);
            addText(`Cédula: ${profileData.postulante.cedula}`);
            addText(`Género: ${profileData.postulante.genero}`);

            // Información extra
            addSection('Presentación');
            addText(profileData.postulante.informacion_extra || '');

            // Redes
            addSection('Redes');
            redes.forEach((red) => {
                addText(`${red.nombre_red}: ${red.enlace}`);
            });

            // Formación académica
            addSection('Formación Académica');
            profileData.formaciones?.forEach((formacion) => {
                addText(`Institución: ${formacion.institucion}`);
                addText(`Título: ${formacion.titulo.titulo}`);
                addText(`Fecha de Inicio: ${formacion.fechaini}`);
                addText(`Fecha de Fin: ${formacion.fechafin}`);
                yOffset += 5; // Espacio adicional entre formaciones
            });

            // Cursos
            addSection('Cursos');
            profileData.cursos?.forEach((curso) => {
                addText(`Nombre del Curso: ${curso.titulo}`);
                addText(`Certificado: ${curso.certificado}`);
                yOffset += 5; // Espacio adicional entre cursos
            });

            // Experiencia
            addSection('Experiencia');
            profileData.experiencia?.forEach((exp) => {
                addText(`Empresa: ${exp.empresa}`);
                addText(`Puesto: ${exp.puesto}`);
                addText(`Fecha de Inicio: ${exp.fechaini}`);
                addText(`Fecha de Fin: ${exp.fechafin}`);
                yOffset += 5; // Espacio adicional entre experiencias
            });

            // Idiomas
            addSection('Idiomas');
            profileData.idiomas?.forEach((idioma) => {
                addText(`Idioma: ${idioma.nombre}`);
                addText(`Nivel Oral: ${idioma.nivel_oral}`);
                addText(`Nivel Escrito: ${idioma.nivel_escrito}`);
                yOffset += 5; // Espacio adicional entre idiomas
            });

            doc.save('perfil.pdf');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!profileData) {
        return <div className="flex justify-center items-center h-screen">No profile data found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-[#111827] rounded-lg shadow-md text-white pb-6" id="profile-content">
            <div className="flex items-center space-x-4">
                <img
                    src={profileData.postulante.foto}
                    alt={`${profileData.postulante.nombres} ${profileData.postulante.apellidos}`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />
                <div>
                    <h1 className="text-3xl font-semibold">
                        {profileData.postulante.nombres} {profileData.postulante.apellidos}
                    </h1>
                    <p className="text-gray-400">{profileData.ubicacion.provincia}, {profileData.ubicacion.canton}</p>
                    <button onClick={openEditModal} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Editar Datos</button>
                    <button onClick={generatePDF} className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700">Descargar PDF</button>
                </div>
            </div>

            <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
                <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Detalles del Perfil</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p><strong>Fecha de Nacimiento:</strong> {profileData.postulante.fecha_nac}</p>
                    <p><strong>Edad:</strong> {profileData.postulante.edad}</p>
                    <p><strong>Estado Civil:</strong> {profileData.postulante.estado_civil}</p>
                    <p>
                        <strong>Cédula:</strong> {profileData.postulante.cedula}
                        {cedulaError && <span className="text-red-500 ml-2">{cedulaError}</span>}
                    </p>
                    <p><strong>Género:</strong> {profileData.postulante.genero}</p>
                </div>
            </div>

            <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-inner text-gray-200">
                <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Presentación</h2>
                <p className="text-gray-400">{profileData.postulante.informacion_extra}</p>
            </div>

            <div className="mt-6 bg-gray-800 p-4 rounded-lg pb-6 shadow-inner text-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Redes</h2>
                    <button onClick={openAddRedModal} className="text-orange-400 hover:underline">
                        + Agregar red
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
                    {redes && redes.length > 0 ? (
                        redes.map((red: any) => (
                            <div key={red.id_postulante_red} className="flex items-center space-x-2">
                                <span>{red.nombre_red}</span>
                                <a href={red.enlace} target="_blank" rel="noopener noreferrer" className="text-2xl hover:underline">
                                    {renderIcon(red.nombre_red)}
                                </a>
                            </div>
                        ))
                    ) : (
                        <p>No hay redes sociales agregadas.</p>
                    )}
                </div>
            </div>

            <Tabs
                profileData={profileData}
                openEditFormacionModal={openEditFormacionModal}
                handleDeleteFormacion={reloadProfile}
                openModal={openModal}
                openEditLanguageModal={openEditLanguageModal}
                openEditCursoModal={openEditCursoModal}
                handleDeleteCurso={reloadProfile}
                handleViewCV={(id: number) => { }} // Implementa según tu lógica
                handleDownloadCV={(url: string) => { }} // Implementa según tu lógica
            />

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Agregar Información"
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto my-20 relative"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
                    &times;
                </button>
                {modalContent === 'formacion' && (
                    <FormacionPEditar
                        isOpen={isModalOpen}
                        closeModal={closeModal}
                        reloadProfile={reloadProfile}
                        formacion={selectedFormacion}
                    />
                )}
                {modalContent === 'curso' && (
                    <EditCurso
                        isOpen={isModalOpen}
                        closeModal={closeModal}
                        reloadProfile={reloadProfile}
                        curso={selectedCurso}
                    />
                )}
                {/* Agrega el contenido de los otros modales aquí */}
            </Modal>

            <EditPostulanteModal
                isOpen={isEditModalOpen}
                closeModal={closeEditModal}
                postulante={profileData.postulante}
                onProfileUpdate={handleProfileUpdate}
            />

            <AddRedModal
                isOpen={isAddRedModalOpen}
                onRequestClose={closeAddRedModal}
                reloadProfile={reloadProfile}
                idPostulante={profileData.postulante.id_postulante}
            />

            <AddIdiomaModal
                isOpen={isAddIdiomaModalOpen}
                onRequestClose={closeAddIdiomaModal}
                onIdiomaAdded={reloadProfile} // Llama a reloadProfile después de agregar un idioma
                languages={languages}
                userId={profileData.postulante.id_postulante}
            />
        </div>
    );
};

export default Profile;
