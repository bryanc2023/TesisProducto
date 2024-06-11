import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from "../../services/axios";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

interface IFormInput {
  logo: FileList;
  companyName: string;
  numberOfEmployees: string;
  sector: string;
  division: string;
  email: string;
  contactNumber: string;
  socialLinks: { platform: string; url: string }[];
  description: string;
}

interface Division {
  id: number;
  division: string;
}

const CompletarE: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IFormInput>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
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

 
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([{ platform: '', url: '' }]);

  const [sectores, setSectores] = useState<string[]>([]);
  const [divisiones, setDivisiones] = useState<Division[]>([]); // Usar el tipo de interfaz para divisiones
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null); // Cambiar el tipo a Division | null
  const [isDivisionEnabled, setIsDivisionEnabled] = useState<boolean>(false);

  useEffect(() => {
    const fetchSectores = async () => {
      try {
        const response = await axios.get('sectores'); // Utilizar axios desde el servicio
        setSectores(response.data.sectores);
      } catch (error) {
        console.error('Error fetching sectores:', error);
      }
    };

    fetchSectores();
  }, []);

  const handleSectorChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedSector(selected);
    setIsDivisionEnabled(false); // Deshabilitar divisiones hasta que se carguen
    if (selected) {
      try {
        const response = await axios.get(`sectores/${encodeURIComponent(selected)}`); // Utilizar axios desde el servicio
        setDivisiones(response.data);
        setIsDivisionEnabled(true); // Habilitar divisiones después de cargar
      } catch (error) {
        console.error('Error fetching divisiones:', error);
      }
    }
  };


  const socialPlatforms = [
    { value: 'facebook', label: 'Facebook', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' },
    { value: 'x', label: 'X', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/X_logo.svg'  }, 
    { value: 'instagram', label: 'Instagram', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' },
    { value: 'linkedin', label: 'LinkedIn', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo.svg' },
    // Agrega más plataformas aquí
  ];
  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const handleSocialLinkChange = (index: number, field: keyof typeof socialLinks[0], value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
    setValue('socialLinks', newLinks);
  };
  

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (user && selectedDivision && selectedProvince && selectedCanton) {
      try {
        const response = await axios.get(`ubicaciones/${selectedProvince}/${selectedCanton}`);
        const ubicacionId = response.data.ubicacion_id;
        console.log(selectedDivision.id);
        console.log(ubicacionId);
        const formData = new FormData();
        formData.append('logo', data.logo[0]);
        formData.append('companyName', data.companyName);
        formData.append('numberOfEmployees', data.numberOfEmployees);
        formData.append('sector', selectedDivision.id.toString());
        formData.append('ubicacion', ubicacionId.toString());
        formData.append('division', data.division);
        formData.append('email', data.email);
        formData.append('description', data.description);
        formData.append('usuario_id', user.id.toString());

       // socialLinks.forEach((link, index) => {
       //   formData.append(`socialLinks[${index}][platform]`, link.platform);
      //    formData.append(`socialLinks[${index}][url]`, link.url);
      //  });

        for (const entry of formData.entries()) {
          console.log(entry);
        }
        await axios.post('empresaC', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log("Registro exitoso");
        navigate("/inicio-e");
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-5 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">Completar registro de empresa</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="form-group mb-8">
          <label htmlFor="logo" className="block text-gray-700 font-semibold mb-2">Logo:</label>
          <div className="flex items-center">
            {logoPreview ? (
              <img src={logoPreview} alt="Preview" className="w-40 h-40 object-cover border border-gray-300 mr-4 rounded-lg" />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center border border-gray-300 mr-4 rounded-lg bg-gray-200 text-gray-700 text-center">
                Seleccionar logo
              </div>
            )}
            <input type="file" id="logo" {...register('logo')} onChange={handleLogoChange} className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 ${errors.logo ? 'border-red-500' : ''}`} />
            {errors.logo && <p className="text-red-500 text-xs mt-1">El logo es requerido.</p>}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-8 mb-8">
          <div className="form-group col-span-7 md:col-span-5">
            <label htmlFor="companyName" className="block text-gray-700 font-semibold mb-2">Nombre comercial:</label>
            <input type="text" id="companyName" {...register('companyName')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
          </div>

          <div className="form-group col-span-7 md:col-span-2">
            <label htmlFor="numberOfEmployees" className="block text-gray-700 font-semibold mb-2">Número de empleados:</label>
            <input type="number" id="numberOfEmployees" {...register('numberOfEmployees')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
          </div>
        </div>

        <div className="form-group mb-8">
        <label htmlFor="sector" className="block text-gray-700 font-semibold mb-2">Sector:</label>
        <select id="sector" onChange={handleSectorChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600">
          <option value="">Seleccione</option>
          {sectores.map((sector, index) => (
            <option key={index} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mb-8">
        <label htmlFor="division" className="block text-gray-700 font-semibold mb-2">División:</label>
        <select
          id="division"
          value={selectedDivision?.division || ''}
          onChange={(e) => {
            const selected = divisiones.find(div => div.division === e.target.value);
            setSelectedDivision(selected || null);
          }}
          disabled={!isDivisionEnabled}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
        >
          <option value="">Seleccione</option>
          {divisiones.map((division) => (
            <option key={division.id} value={division.division}>
              {division.division}
            </option>
          ))}
        </select>
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
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Correo de contacto:</label>
            <input type="email" id="email" {...register('email')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber" className="block text-gray-700 font-semibold mb-2">Número de contacto:</label>
            <input type="tel" id="contactNumber" {...register('contactNumber')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600" />
          </div>
        </div>

        <div className="form-group mb-8">
          <label className="block text-gray-700 font-semibold mb-2">Enlaces de redes sociales:</label>
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center mb-4">
              <select
                value={link.platform}
                onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                className="w-1/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 mr-2"
              >
                <option value="">Seleccione</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
              <span className="mr-2">
                {link.platform && <img src={socialPlatforms.find(platform => platform.value === link.platform)?.logo} alt={link.platform} className="w-6 h-6 inline-block" />}
              </span>
              <input
                type="text"
                value={link.url}
                onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                className="w-3/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                placeholder="URL de la red social"
              />
            </div>
          ))}
          <button type="button" onClick={handleAddSocialLink} className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-slate-600">Añadir otra red social</button>
        </div>

        <div className="form-group mb-8">
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Descripción:</label>
          <textarea id="description" {...register('description')} placeholder="Descripción de la empresa..." className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"></textarea>
        </div>

        <button type="submit" className="w-full py-3 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-slate-600">Registrar empresa</button>
      </form>
    </div>
  );
};

export default CompletarE;
