import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api/', // Dirección base de la API
    headers: {
        'Content-Type': 'application/json', // Tipo de contenido predeterminado
    },
});

export default instance;