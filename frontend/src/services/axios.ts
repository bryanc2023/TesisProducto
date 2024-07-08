import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Dirección base de la API
  
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Enviar el token JWT
    }
});


export default instance;