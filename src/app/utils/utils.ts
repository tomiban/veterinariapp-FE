import { Especie } from "../constants/enums/especies.enum"

export const capitalizeFirst = (especie:string) => {
	return especie[0].toUpperCase() + especie.slice(1).toLowerCase()
}

export function obtenerEspecieDesdeString(
	especieString: string
): Especie | undefined {
	const especieEnumKeys = Object.keys(
		Especie
	) as (keyof typeof Especie)[]
	const indice = especieEnumKeys.findIndex(
		(key) => Especie[key] === especieString.toUpperCase()
	)

	if (indice !== -1) {
		return Especie[especieEnumKeys[indice]]
	}

	return undefined
}
