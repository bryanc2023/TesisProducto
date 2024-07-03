interface Empresa {
    id_empresa: number;
    nombre_comercial: string;
    logo: string;
}

interface ListEmpresaProps {
    empresa: {
        id_empresa: number
        nombre_comercial: string
        logo: string
    }
    getEmpresa: (idEmpresa : Empresa['id_empresa']) => void
}

export default function ListEmpresa({empresa, getEmpresa} : ListEmpresaProps) {
  return (
    <button 
        onClick={() => getEmpresa(empresa.id_empresa)}
        className="px-5 py-2 border-y-2 border-x-orange-70 w-full text-gray-700 hover:bg-gray-100"
    >
        <p className="mb-2 text-start">Empresas:</p>
        <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full ring-2 ring-gray-200">
            <img src={empresa.logo} alt={`Foto del postulante ${empresa.nombre_comercial}`} className="h-10 w-10 rounded-full" />
        </div>
        <p className="font-bold"> { empresa.nombre_comercial} </p>
        </div>
    </button>
  )
}
