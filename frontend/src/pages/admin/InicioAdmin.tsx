

import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import React, { useState } from 'react';

import axios from "../../services/axios"

function InicioAdmin() {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleFileChange = (e:any) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        if (file) {
            const data = new FormData();
            data.append('file', file);

            try {
                const response = await axios.post('upload', data, { // Usa la instancia de Axios
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response.data);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    return (
        <div>
            <button onClick={handleLogout}>
                Logout
            </button>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default InicioAdmin