import { Injectable } from "@angular/core"
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar"

@Injectable({
	providedIn: "root",
})
export class SnackbarService {
	constructor(private snackBar: MatSnackBar) {}

	mostrarMensajeExitoso(mensaje: string): void {
		this.abrir(mensaje, "snackbar", 2500)
	}

	mostrarError(mensaje: string): void {
		this.abrir(mensaje, "snackbar-error", 5000)
	}

	private abrir(mensaje: string, panelClass: string, duration: number): void {
		const config: MatSnackBarConfig = {
			duration,
			horizontalPosition: "center",
			verticalPosition: "bottom",
			panelClass,
		}

		this.snackBar.open(mensaje, "Cerrar", config)
	}
}
