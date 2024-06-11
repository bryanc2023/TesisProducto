
import { useEffect } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import { Api } from '../../services/api'; // Asegúrate de que Api esté configurado correctamente
import Swal from 'sweetalert2';



const VerifyEmail= () => {
    const { id, token } = useParams();
    const navigate = useNavigate();
  
    
    useEffect(() => {
        console.log('id:', id);
        console.log('token:', token);
        

        const verifyEmail = async () => {
            try {
                console.log('Verifying email with id:', id, 'and token:', token);
                const response = await Api.get(`/auth/verifyEmail/${id}/${token}`);
                console.log('Response:', response);

                if (response.statusCode === 200) {
                    await Swal.fire({
                        icon: 'success',
                        title: '¡Correo verificado!',
                        text: 'Tu correo ha sido verificado exitosamente. Ya puedes logearte correctamente.',
                    });
                    navigate('/login');
                } else if (response.statusCode === 401) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error de verificación',
                        text: 'Este enlace ya ha sido verificado.',
                    });
                    navigate('/');
                } else if (response.statusCode === 400) {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error de verificación',
                        text: 'Este enlace es inválido.',
                    });
                    navigate('/');
                } 
                else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error de verificación',
                        text: 'No se pudo verificar tu correo. Inténtalo de nuevo.',
                    });
                    navigate('/');
                }
            } catch (error) {
                console.error('Error al verificar el correo:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error de verificación',
                    text: 'Ocurrió un error al verificar tu correo. Inténtalo de nuevo.',
                });
                navigate('/');
            }
        };

        verifyEmail();
    }, [id, token, navigate]);

    return <div>Verificando tu correo...</div>;
};

export default VerifyEmail;