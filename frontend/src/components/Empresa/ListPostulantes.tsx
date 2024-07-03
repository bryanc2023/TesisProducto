
interface ListPostulantesProps {
    postulante: {
        id_postulante: number
        nombres: string
        apellidos: string
        foto: string
    }
    getPostulante: (postulante: Postulante) => void
}

interface Postulante {
    id_postulante: number
    nombres: string
    apellidos: string
    foto: string
}


export default function ListPostulantes({ postulante, getPostulante }: ListPostulantesProps) {
    return (
      <button 
        onClick={() => getPostulante(postulante)} // Llama a la función con los datos del postulante
        className="px-5 py-2 border-y-2 border-x-orange-70 w-full text-gray-700 hover:bg-gray-100"
      >
        <p className="mb-2 text-start">Postulante:</p>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full ring-2 ring-gray-200">
            <img src={postulante.foto} alt={`Foto del postulante ${postulante.nombres}`} className="h-10 w-10 rounded-full" />
          </div>
          <p className="font-bold">{`${postulante.nombres} ${postulante.apellidos}`}</p>
        </div>
      </button>
    );
  }
  