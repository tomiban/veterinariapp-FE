import { Component, Inject } from "@angular/core"
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"

export interface ConfirmarDialogData {
	titulo: string
	mensaje: string
	accion?: string
}

@Component({
	selector: "app-confirmar-dialog",
	standalone: true,
	imports: [MatDialogModule, MatButtonModule],
	template: `
		<h2 mat-dialog-title>{{ data.titulo }}</h2>
		<mat-dialog-content>{{ data.mensaje }}</mat-dialog-content>
		<mat-dialog-actions align="end">
			<button mat-button [mat-dialog-close]="false">Cancelar</button>
			<button mat-flat-button color="warn" [mat-dialog-close]="true">
				{{ data.accion ?? "Borrar" }}
			</button>
		</mat-dialog-actions>
	`,
})
export class ConfirmarDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmarDialogData) {}
}
