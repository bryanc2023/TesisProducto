import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from "../../services/axios";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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
  province:string;
  canton:string;
}

const CompletarP: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cantons, setCantons] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('');

  useEffect(() => {
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

  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(event.target.value);
    setSelectedCanton('');
  };

  const handleCantonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCanton(event.target.value);
  };

  const getMaxBirthDate = () => {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 18); // Restar 18 años
    return currentDate.toISOString().split('T')[0];
  };

  const getMinBirthDate = () => {
    const minDate = new Date(1900, 0, 1);
    return minDate.toISOString().split('T')[0];
  };

  const validateCedula = (value: string) => {
    if (value.length !== 10) return false;
    const digits = value.split('').map(Number);
    const provinceCode = parseInt(value.substring(0, 2), 10);
    const thirdDigit = digits[2];

    if (provinceCode < 1 || provinceCode > 24 || thirdDigit > 5) return false;

    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const total = digits.slice(0, 9).reduce((acc, digit, index) => {
      let product = digit * coefficients[index];
      if (product >= 10) product -= 9;
      return acc + product;
    }, 0);

    const checkDigit = total % 10 === 0 ? 0 : 10 - (total % 10);
    return checkDigit === digits[9];
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (user && selectedProvince && selectedCanton) {
      try {
        const response = await axios.get(`ubicaciones/${selectedProvince}/${selectedCanton}`);
        const ubicacionId = response.data.ubicacion_id;

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

        await axios.post('postulanteC', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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
            <input type="file" id="image" {...register('image', { required: 'La imagen es requerida' })} onChange={handleImageChange} className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 ${errors.image ? 'border-red-500' : ''}`} />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="form-group">
            <label htmlFor="firstName" className="block text-gray-700 font-semibold mb-2">Nombres:</label>
            <input type="text" id="firstName" {...register('firstName', { required: 'Nombres son requeridos' })} className={getInputClassName(errors.firstName)} />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="block text-gray-700 font-semibold mb-2">Apellidos:</label>
            <input type="text" id="lastName" {...register('lastName', { required: 'Apellidos son requeridos' })} className={getInputClassName(errors.lastName)} />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="form-group">
            <label htmlFor="province" className="block text-gray-700 font-semibold mb-2">Provincia:</label>
            <select id="province" {...register('province', { required: 'Provincia es requerida' })} className={getInputClassName(errors.province)} onChange={handleProvinceChange}>
              <option value="">Seleccione</option>
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
            {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="canton" className="block text-gray-700 font-semibold mb-2">Cantón:</label>
            <select id="canton" {...register('canton', { required: 'Cantón es requerido' })} className={getInputClassName(errors.canton)} disabled={!selectedProvince} onChange={handleCantonChange}>
              <option value="">Seleccione</option>
              {cantons.map((canton, index) => (
                <option key={index} value={canton}>
                  {canton}
                </option>
              ))}
            </select>
            {errors.canton && <p className="text-red-500 text-xs mt-1">{errors.canton.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="form-group">
            <label htmlFor="birthDate" className="block text-gray-700 font-semibold mb-2">Fecha de nacimiento:</label>
            <input type="date" id="birthDate" {...register('birthDate', { required: 'Fecha de nacimiento es requerida' })} className={getInputClassName(errors.birthDate)} min={getMinBirthDate()} max={getMaxBirthDate()} />
            {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="idNumber" className="block text-gray-700 font-semibold mb-2">Cédula:</label>
            <input type="text" id="idNumber" {...register('idNumber', { required: 'Cédula es requerida', validate: validateCedula })} className={getInputClassName(errors.idNumber)} />
            {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber.type === 'validate' ? 'Cédula inválida' : errors.idNumber.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="form-group">
            <label htmlFor="gender" className="block text-gray-700 font-semibold mb-2">Género:</label>
            <select id="gender" {...register('gender', { required: 'Género es requerido' })} className={getInputClassName(errors.gender)}>
              <option value="">Seleccione</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="maritalStatus" className="block text-gray-700 font-semibold mb-2">Estado civil:</label>
            <select id="maritalStatus" {...register('maritalStatus', { required: 'Estado civil es requerido' })} className={getInputClassName(errors.maritalStatus)}>
              <option value="">Seleccione</option>
              <option value="Soltero">Soltero/a</option>
              <option value="Casado">Casado/a</option>
              <option value="Divorciado">Divorciado/a</option>
              <option value="Viudo">Viudo/a</option>
            </select>
            {errors.maritalStatus && <p className="text-red-500 text-xs mt-1">{errors.maritalStatus.message}</p>}
          </div>
        </div>

        <div className="form-group mb-8">
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Descripción sobre ti:</label>
          <textarea id="description" {...register('description', { required: 'Descripción es requerida' })} placeholder="Habilidades y competencias propias..." className={getInputClassName(errors.description)}></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <button type="submit" className="w-full py-3 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-slate-600">CONTINUAR</button>
      </form>
    </div>
  );
};

export default CompletarP;
