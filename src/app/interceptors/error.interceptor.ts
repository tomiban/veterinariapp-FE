import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { catchError, throwError } from "rxjs"
import { SnackbarService } from "../services/snackbar.service"

// Un solo lugar para avisar de errores de la API: los componentes solo apagan su loading.
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const snackbar = inject(SnackbarService)

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			snackbar.mostrarError(mensajeDeError(error))
			return throwError(() => error)
		})
	)
}

function mensajeDeError(error: HttpErrorResponse): string {
	if (error.status === 0) {
		return "No pudimos conectar con el servidor. Probá de nuevo en unos segundos."
	}
	if (error.status === 404) {
		return "No encontramos lo que buscabas: puede que se haya borrado."
	}
	if (error.status === 400) {
		if (typeof error.error === "string" && error.error) return error.error
		const errores = error.error?.errors as Record<string, string[]> | undefined
		const primero = errores && Object.values(errores)[0]?.[0]
		return primero ?? "Revisá los datos ingresados."
	}
	return "Algo salió mal en el servidor. Probá de nuevo."
}
