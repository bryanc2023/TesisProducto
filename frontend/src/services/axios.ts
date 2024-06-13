import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api/', // Dirección base de la API
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Enviar el token JWT
    }
});

export default instance;