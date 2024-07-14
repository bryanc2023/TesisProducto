import  { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import axios from '../services/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

const EmailForm = () => {
    const [email, setEmail] = useState('');
    const [message] = useState('');
    const navigate = useNavigate();
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/ResetPassword3', { email });
           
             
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: response.data.message,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            }); 
            navigate('/');
        } catch (error) {
            if(isAxiosError(error) && error.response){
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: error.response.data.message,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                }); 
                
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4 text-center">Ingresa tu Email</h1>
                    <p className="mb-4 text-center text-gray-600">
                        Enviaremos un correo de confirmación para que puedas recuperar tu contraseña.
                    </p>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-bold mb-2">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="e-mail"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <button
                        className=' bg-blue-700 text-white text-center py-3 px-5 rounded-lg shadow font-bold hover:bg-blue-500 w-full'
                        onClick={handleSubmit}
                    >
                        Enviar
                    </button>
                    {message && <p className="mt-4 text-center">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default EmailForm;
