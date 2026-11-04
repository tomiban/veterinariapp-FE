import { Especie } from "./enums/especies.enum"
import { Sexo } from "./enums/sexo.enum"

export const ESPECIES: Especie[] = Object.values(Especie)
export const SEXOS: Sexo[] = Object.values(Sexo)

const IMAGENES: Record<string, string> = {
	[Especie.GATO]: "assets/img/cat.png",
	[Especie.PERRO]: "assets/img/dog.png",
	[Especie.ROEDOR]: "assets/img/squirrel.png",
	[Especie.CONEJO]: "assets/img/rabbit.png",
	[Sexo.MACHO]: "assets/img/male-symbol.png",
	[Sexo.HEMBRA]: "assets/img/female-symbol.png",
}

export function obtenerRutaImagen(parametro?: Especie | Sexo | string | null): string {
	return (parametro && IMAGENES[parametro]) || "assets/img/dog.png"
}
