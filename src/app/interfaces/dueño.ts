import { Mascota } from "./mascota"

export interface Dueño {
	id?: number
	nombre: string
	telefono?: string | null
	domicilio?: string | null
	cantidadMascotas?: number
	mascotas?: Mascota[]
}
