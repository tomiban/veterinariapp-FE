import { Injectable } from "@angular/core"
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar"

@Injectable({
	providedIn: "root",
})
export class SnackbarService {
	constructor(private snackBar: MatSnackBar) {}

	mostrarMensajeExitoso(mensaje: string): void {
		const config: MatSnackBarConfig = {
			duration: 2000,
			horizontalPosition: "center",
			verticalPosition: "bottom",
			panelClass: "snackbar",
		}

		this.snackBar.open(mensaje, "X", config)
	}
}
