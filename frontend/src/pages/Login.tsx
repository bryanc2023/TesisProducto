import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import InputLabel from '../components/input/InputLabel';
import Button from '../components/input/Button';
import * as Yup from 'yup';
import { useAppDispatch ,RootState} from '../store';
import { loginUser } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../components/layout/Navbar';

const Login = () => {

    const [idEmpresa, setIdEmpresa] = useState(null); 
    const dispatch = useAppDispatch();
    const initialValues = {
        email: '',
        password: ''
    };

    const navigate = useNavigate();
    const { isLogged, role } = useSelector((state: RootState) => state.auth);
  
    useEffect(() => {
        if (isLogged && role) {
            if (role === 'postulante') {
                navigate('/verOfertasAll');
            } else if (role === 'empresa_oferente') {
                navigate('/inicio-e');
            } else if (role === 'admin') {
                navigate('/inicioAdmin');
            } else if (role === 'empresa_gestora') {
                navigate('/inicioG');
            }
        }
    }, [isLogged, role, navigate]);
    
    const onSubmit = (values: typeof initialValues) => {
        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor, espera mientras se procesa tu login.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading(Swal.getConfirmButton());
            }
        });

        dispatch(loginUser(values)).then((response) => {
            Swal.close();
            
            if (response.payload === "403") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de verificación',
                    text: 'Este usuario no ha sido verificado todavía, por favor verifica el enlace en tu correo para continuar con el login',
                });
            } else if (response.payload === "401") {
                Swal.fire({
                    icon: 'error',
                    title: 'Credenciales inválidas',
                    text: 'El usuario o contraseña ingresado no es correcto',
                });
            } else if (response.type === 'auth/loginUser/fulfilled') {
                const { user, token, role } = response.payload;

                if (role === 'admin') {
                    navigate("/configuracion");
                } else if (role === 'postulante') {
                    if (user.first_login_at === null) {
                        navigate("/completar");
                    } else {
                        navigate("/verOfertasAll");
                    }
                } else if (role === 'empresa_oferente') {
                    setIdEmpresa(user.id);
                    localStorage.setItem("idEmpresa", user.id); 
                    
                    if (user.first_login_at === null) {
                        navigate("/completare");
                    } else {
                        navigate("/verOfertasE");
                    }
                } else if (role === 'empresa_gestora') {
                    setIdEmpresa(user.id);
                    localStorage.setItem("idEmpresa", user.id); 
                    navigate("/inicioG");
                }
            }
        });
    };

    const validationSchema = Yup.object({
       email: Yup.string()
       .email('El correo no es válido')
       .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(es|ec|com)$/, 'El correo debe ser de un dominio que termine en .es, .ec o .com')
       .required('El correo es requerido'),
       password: Yup.string()
       .min(6, 'La contraseña debe ser minímo de 6 letras y números')
       .required('La contraseña es requerida'),
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row space-y-2">
            <Navbar />
            <div className="lg:w-7/12 xl:w-2/3 flex items-center justify-center">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Inicio de sesión</h2>
                    </div>
                    <h2 className="text-center italic">Ingrese sus credenciales a continuación:</h2>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                            validationSchema={validationSchema}
                        >
                            {({
                                values,
                                errors,
                                handleChange,
                                handleSubmit,
                            }) => (
                                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                    <InputLabel label="Correo" name="email" id="email" placeholder="Correo Electrónico" type="email" error={errors.email} onChange={handleChange} value={values.email} />
                                    <InputLabel label="Contraseña" name="password" id="password" placeholder="Contraseña" type="password" error={errors.password} onChange={handleChange} value={values.password} />
                                    <Button value="Iniciar Sesión" type="submit" />
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
            <div className="relative lg:w-5/12 xl:w-1/2 flex items-center justify-center overflow-hidden">
                <img className="object-cover h-screen w-full" src="/images/login.jpg" alt="Imagen" />
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
            </div>
        </div>
    );
}

export default Login;
