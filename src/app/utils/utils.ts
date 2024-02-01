import { EspecieAnimal } from "../constants/enums/especies.enum"

export const capitalizeFirst = (especie:string) => {
	return especie[0].toUpperCase() + especie.slice(1).toLowerCase()
}

export function obtenerEspecieDesdeString(
	especieString: string
): EspecieAnimal | undefined {
	const especieEnumKeys = Object.keys(
		EspecieAnimal
	) as (keyof typeof EspecieAnimal)[]
	const indice = especieEnumKeys.findIndex(
		(key) => EspecieAnimal[key] === especieString.toUpperCase()
	)

	if (indice !== -1) {
		return EspecieAnimal[especieEnumKeys[indice]]
	}

	return undefined
}
