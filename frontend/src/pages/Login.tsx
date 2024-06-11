import { Formik } from 'formik';

import InputLabel from '../components/input/InputLabel';
import Button from '../components/input/Button';
import * as Yup from 'yup';
import { useAppDispatch ,RootState} from '../store';
import { loginUser } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Swal from 'sweetalert2';



const Login = () => {


    const dispatch = useAppDispatch();
    const initialValues={
        email: '',
        password: ''
    };

    //para navegar si esta logeado
    const navigate = useNavigate();
    const {isLogged, role }= useSelector((state:RootState) => state.auth)
    //para evitar que vuelva al login
  
   useEffect(() => {
       if (isLogged && role ) {
         // Redireccionar al dashboard o a iniciow dependiendo del rol
         if (role === 'postulante') {
            navigate('/inicio');
        } else if (role === 'empresa_oferente') {
            navigate('/iniciow');
        }
        }
    }, [isLogged, role, navigate]);
    
    const onSubmit = (values:typeof initialValues)=>{

        dispatch(loginUser(values)).then((response)=>{
           
           if(response.payload ===  "403"){
                Swal.fire({
                    icon: 'error',
                    title: 'Error de verificación',
                    text: 'Este usuario no ha sido verificado todavia, porfavor verifica el enlace en tu correo para continuar con el login',
                })
            }else if(response.payload ===  "401"){
                Swal.fire({
                    icon: 'error',
                    title: 'Credenciales inválidas',
                    text: 'El usuario o contraseña ingresado no es el correcto',
                })
            } 
            console.log(response.payload.user.first_login_at);
            if(response.type === 'auth/loginUser/fulfilled'){
                console.log(response.payload);
                
                const { user, token, role } = response.payload;
                
                    if (role === 'admin') {
                        navigate("/administrador");
                    } else if (role === 'postulante') {
                        if (user.first_login_at === null) {
                            navigate("/completar");
                        }else{
                            navigate("/inicio");
                        }
                    } else if (role === 'empresa_oferente') {
                        if (user.first_login_at === null) {
                            navigate("/completare");
                        }else{
                            navigate("/inicio-e");
                        }
                    } 
                
                
               
            }
        })
    }

    const validationSchema = Yup.object({
       email:Yup.string().email('El correo no es válido')
       .matches(/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|outlook\.es|hotmail\.com|hotmail\.es)$/, 'El correo debe ser de dominio gmail.com, outlook.com o hotmail.com').required('El correo es requerido'),
       password:Yup.string().min(6,'La contraseña debe ser minímo de 6 letras y números').required('La contraseña es requerida'),
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row space-y-2" >
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
                            validationSchema={validationSchema}>
                                {({
                                    values,
                                    errors,
                                    handleChange,
                                    handleSubmit,
                                }) => (
                            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                <InputLabel label="Correo" name="email" id="email" placeholder="Correo Electrónico" type="email"error={errors.email} onChange={handleChange} value={values.email}/>
                                <InputLabel label="Contraseña" name="password" id="password" placeholder="Contraseña" type="password"error={errors.password} onChange={handleChange} value={values.password}/>
                                <Button value="Iniciar Sesión" type="submit" />
                            </form>
                           )}
                            </Formik>
                          
                           
                        </div>
                        </div>
                        </div>
                       
                    
                   
            <div className="relative lg:w-5/12 xl:w-1/2 flex items-center justify-center overflow-hidden">
                <img className="object-cover h-screen w-full" src="/images/login.jpg" alt="Imagen"/>
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>

            </div>
        </div>
    );
}

export default Login