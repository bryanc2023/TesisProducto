import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from "../../services/axios"
import { useSelector } from 'react-redux';
import { RootState} from '../../store';
import { useNavigate } from 'react-router-dom';


interface IFormInput {
  image: FileList;
  firstName: string;
  lastName: string;
  birthDate: string;
  idNumber: string;
  gender: string;
  maritalStatus: string;
  description: string;
}

const CompletarP: React.FC = () => {
  const navigate = useNavigate();
  const { user }= useSelector((state:RootState) => state.auth)
  const { register, handleSubmit , formState: { errors }} = useForm<IFormInput>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [provinces, setProvinces] = useState([]);
  const [cantons, setCantons] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('');

  useEffect(() => {
    // Obtener provincias y cantones al montar el componente
    const fetchData = async () => {
      try {
        const response = await axios.get('ubicaciones');
        setProvinces(response.data.provinces);
        setCantons(response.data.cantons);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Obtener cantones cuando se selecciona una provincia
    const fetchCantons = async () => {
      if (selectedProvince) {
        try {
          const response = await axios.get(`ubicaciones/cantones/${selectedProvince}`);
          setCantons(response.data);
        } catch (error) {
          console.error('Error fetching cantons:', error);
        }
      }
    };

    fetchCantons();
  }, [selectedProvince]);

  const handleProvinceChange = (event:any) => {
    setSelectedProvince(event.target.value);
    setSelectedCanton('');
  };
  const handleCantonChange = (event:any) => {
    setSelectedCanton(event.target.value);
  };

 // Función para obtener la fecha actual menos 15 años
 const getMaxBirthDate = () => {
  const currentDate = new Date();
  const maxYear = currentDate.getFullYear() - 17;
  const maxDate = new Date(maxYear, 11, 31); // 11 representa diciembre
  return maxDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

const getMinBirthDate = () => {
  const minDate = new Date(1900, 0, 1); // 0 representa enero
  return minDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    
    if (user && selectedProvince && selectedCanton) { // Asegúrate de que se haya seleccionado una provincia y un cantón
      try {
          const response = await axios.get(`ubicaciones/${selectedProvince}/${selectedCanton}`);
          const ubicacionId = response.data.ubicacion_id;
          

          // Ahora puedes enviar el ID de la ubicación junto con otros datos del formulario
          const formData = new FormData();
          formData.append('image', data.image[0]); 
          formData.append('firstName', data.firstName);
          formData.append('lastName', data.lastName);
          formData.append('ubicacion_id', ubicacionId.toString());
          formData.append('birthDate', data.birthDate);
          formData.append('idNumber', data.idNumber);
          formData.append('gender', data.gender);
          formData.append('maritalStatus', data.maritalStatus);
          formData.append('description', data.description);
          formData.append('usuario_id', user.id.toString());
         
          for (const entry of formData.entries()) {
            console.log(entry);
          }
          axios.post('postulanteC', formData,{ // Usa la instancia de Axios
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
          console.log("Exito");
          navigate("/completar-2");
          
      } catch (error) {
          console.error('Error fetching ubicacion ID:', error);
      }
  }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
   // Función para obtener la clase de estilo del input
   const getInputClassName = (error: any) => {
    return error ? "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600" : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600";
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-5 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">Completar registro</h1>
      <p className="text-center mb-8">Para comenzar la experiencia de ProaJob complete el registro con los campos solicitados:</p>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="form-group mb-8">
          <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">FOTO:</label>
          <div className="flex items-center">
          {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover border border-gray-300 mr-4 rounded-lg" />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center border border-gray-300 mr-4 rounded-lg bg-gray-200 text-gray-700 text-center">
                Seleccionar imagen
              </div>
            )}
               <input type="file" id="image" {...register('image')} onChange={handleImageChange} className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 ${errors.image ? 'border-red-500' : ''}`} />
               {errors.image && <p className="text-red-500 text-xs mt-1">La imagen es requerida.</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="form-group">
            <label htmlFor="firstName" className="block text-gray-700 font-semibold mb-2">Nombres:</label>
            <input type="text" id="firstName" {...register('firstName')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="block text-gray-700 font-semibold mb-2">Apellidos:</label>
            <input type="text" id="lastName" {...register('lastName')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="form-group">
             <label htmlFor="province" className="block text-gray-700 font-semibold mb-2">Provincia:</label>
        <select
          id="province"
         
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
          onChange={handleProvinceChange}
          style={{ position: 'relative' }}
        >
          <option value="">Seleccione</option>
          {provinces.map((province, index) => (
            <option key={index} value={province}>
              {province}
            </option>
          ))}
        </select>
          </div>

          <div className="form-group">
          <label htmlFor="canton" className="block text-gray-700 font-semibold mb-2">Cantón:</label>
        <select
          id="canton"
          
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
          disabled={!selectedProvince}
          onChange={handleCantonChange}
          style={{ position: 'relative' }}
        >
          <option value="">Seleccione</option>
          {cantons.map((canton, index) => (
            <option key={index} value={canton}>
              {canton}
            </option>
          ))}
        </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="form-group">
            <label htmlFor="birthDate" className="block text-gray-700 font-semibold mb-2">Fecha de nacimiento:</label>
            <input type="date" id="birthDate" {...register('birthDate')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"min={getMinBirthDate()} max={getMaxBirthDate()}  />
          </div>

          <div className="form-group">
            <label htmlFor="idNumber" className="block text-gray-700 font-semibold mb-2">Cédula:</label>
            <input type="text" id="idNumber" {...register('idNumber')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="form-group">
            <label htmlFor="gender" className="block text-gray-700 font-semibold mb-2">Género:</label>
            <select id="gender" {...register('gender')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600">
              <option value="">Seleccione</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="maritalStatus" className="block text-gray-700 font-semibold mb-2">Estado civil:</label>
            <select id="maritalStatus" {...register('maritalStatus')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600">
              <option value="">Seleccione</option>
              <option value="Soltero">Soltero/a</option>
              <option value="Casado">Casado/a</option>
              <option value="Divorciado">Divorciado/a</option>
              <option value="Viudo">Viudo/a</option>
            </select>
          </div>
        </div>

        <div className="form-group mb-8">
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Descripción sobre ti:</label>
          <textarea id="description" {...register('description')} placeholder="Habilidades y competencias propias..." className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"></textarea>
        </div>

        <button type="submit" className="w-full py-3 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-slate-600">CONTINUAR</button>
      </form>
    </div>
  );
};

export default CompletarP;
