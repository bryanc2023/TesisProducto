<?php

namespace App\Helpers;

class StringHelper
{
    public static function normalize($string)
    {
        $string = strtolower($string);

        // Eliminar caracteres especiales y números
        $string = preg_replace('/[^a-záéíóúüñ\s]/u', '', $string);

        // Normalizar cada palabra
        $words = explode(' ', $string);
        $normalizedWords = [];

        foreach ($words as $word) {
            $word = preg_replace('/[áàäâãå]/u', 'a', $word);
            $word = preg_replace('/[éèëê]/u', 'e', $word);
            $word = preg_replace('/[íìïî]/u', 'i', $word);
            $word = preg_replace('/[óòöôõ]/u', 'o', $word);
            $word = preg_replace('/[úùüû]/u', 'u', $word);
            $word = preg_replace('/[ñ]/u', 'n', $word);
            
            // Verificar si la palabra resultante no está vacía
            if (!empty($word)) {
                $normalizedWords[] = $word;
            }
        }

        // Unir las palabras normalizadas
        $normalizedString = implode(' ', $normalizedWords);

        return $normalizedString;
    }

    public static function removeAccents($string)
    {
        // Define un array de mapeo de caracteres con tilde a caracteres sin tilde
        $map = [
            'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
            'Á' => 'A', 'É' => 'E', 'Í' => 'I', 'Ó' => 'O', 'Ú' => 'U',
            'ñ' => 'n', 'Ñ' => 'N',
        ];

        // Reemplaza los caracteres con tilde por sus equivalentes sin tilde
        return strtr($string, $map);
    }
}
