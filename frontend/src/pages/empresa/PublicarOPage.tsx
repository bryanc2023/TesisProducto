import React from 'react';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import '../../pages/css/RegisterPage.css';

function PublicarOPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = handleSubmit(async (values) => {
        // Aquí podrías añadir la lógica para enviar los datos
        Swal.fire({
            title: '¡Publicada!',
            text: 'La oferta se encuentra publicada',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Publicar Oferta</h3>
            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="area">Área</label>
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        id="area"
                        placeholder="En donde se aplica la plaza..."
                        {...register('area', { required: true })}
                    />
                    {errors.area && <p className="text-red-500">Área es requerida</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="modalidad">Modalidad</label>
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        id="modalidad"
                        placeholder="Presencial o virtual"
                        {...register('modalidad', { required: true })}
                    />
                    {errors.modalidad && <p className="text-red-500">Modalidad es requerida</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="cargaHoraria">Carga Horaria</label>
                    <input
                        className="w-full p-2 border rounded"
                        type="number"
                        id="cargaHoraria"
                        placeholder="En horas"
                        {...register('cargaHora', { required: true })}
                    />
                    {errors.cargaHora && <p className="text-red-500">Carga Horaria es requerida</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="salario">Salario</label>
                    <input
                        className="w-full p-2 border rounded"
                        type="number"
                        id="salario"
                        placeholder="$"
                        {...register('salario', { required: true })}
                    />
                    {errors.salario && <p className="text-red-500">Salario es requerido</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="tituloRequerido">Titulo Requerido</label>
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        id="tituloRequerido"
                        placeholder="Nivel de experiencia:"
                        {...register('tituloRequerido', { required: true })}
                    />
                    {errors.tituloRequerido && <p className="text-red-500">Título Requerido es requerido</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="anios">Años de experiencia mínima</label>
                    <input
                        className="w-full p-2 border rounded"
                        type="number"
                        id="anios"
                        placeholder="Ninguna o alguna en específico"
                        {...register('experienciaMinima', { required: true })}
                    />
                    {errors.experienciaMinima && <p className="text-red-500">Experiencia Mínima es requerida</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="detalle">Detalles extras:</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        id="detalle"
                        placeholder="Información importante de la oferta"
                        {...register('detalle', { required: true })}
                    ></textarea>
                    {errors.detalle && <p className="text-red-500">Detalles es requerido</p>}
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-lg mt-4"
                >
                    Publicar Oferta
                </button>
            </form>
        </div>
    );
}

export default PublicarOPage;
