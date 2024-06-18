<?php

namespace App\Http\Requests\Postulante;

use Illuminate\Foundation\Http\FormRequest;

class PostulanteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'foto' => 'required|string', // Ejemplo de validación para una imagen
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'ubicacion_id' => 'required|exists:ubicacion,id', // Validación para asegurarse de que el ID de ubicación existe en la tabla 'ubicaciones'
            'birthDate' => 'required|date',
            'idNumber' => 'required|string|max:20',
            'gender' => 'required|string|in:Masculino,Femenino,Otro',
            'maritalStatus' => 'required|string|in:Soltero,Casado,Divorciado,Viudo',
            'description' => 'nullable|string|max:1000',
            'usuario_id' => 'required|exists:users,id', // Validación para asegurarse de que el ID de usuario existe en la tabla 'users'
        ];
    }
}
