import { Injectable } from "@angular/core"
import { MatPaginatorIntl } from "@angular/material/paginator"

@Injectable()
export class PaginadorEs extends MatPaginatorIntl {
	override itemsPerPageLabel = "Por página"
	override nextPageLabel = "Página siguiente"
	override previousPageLabel = "Página anterior"
	override firstPageLabel = "Primera página"
	override lastPageLabel = "Última página"
	override getRangeLabel = (pagina: number, tamaño: number, total: number): string => {
		if (total === 0) return "0 de 0"
		const desde = pagina * tamaño
		const hasta = Math.min(desde + tamaño, total)
		return `${desde + 1} – ${hasta} de ${total}`
	}
}
