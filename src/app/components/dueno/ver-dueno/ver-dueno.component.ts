import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { Dueño } from "../../../interfaces/dueño"
import { DueñoService } from "../../../services/dueno.service"
import { SnackbarService } from "../../../services/snackbar.service"
import { ConfirmacionService } from "../../../services/confirmacion.service"
import { EstadoVacioComponent } from "../../shared/estado-vacio.component"
import { obtenerRutaImagen } from "../../../constants/especies"

@Component({
	selector: "app-ver-dueno",
	standalone: true,
	imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule, EstadoVacioComponent],
	templateUrl: "./ver-dueno.component.html",
	styleUrl: "./ver-dueno.component.css",
})
export class VerDuenoComponent implements OnInit {
	loading = true
	ficha?: Dueño
	id: number
	obtenerRutaImagen = obtenerRutaImagen

	constructor(
		private aRoute: ActivatedRoute,
		private _router: Router,
		private _dueñoService: DueñoService,
		private _sbService: SnackbarService,
		private _confirmacion: ConfirmacionService
	) {
		this.id = Number(this.aRoute.snapshot.paramMap.get("idDueno"))
	}

	ngOnInit(): void {
		this._dueñoService.getDueño(this.id).subscribe({
			next: (dueño) => {
				this.ficha = dueño
				this.loading = false
			},
			error: () => (this.loading = false),
		})
	}

	eliminar() {
		if (!this.ficha) return
		this._confirmacion
			.confirmar({
				titulo: `¿Borrar a ${this.ficha.nombre}?`,
				mensaje: this.ficha.mascotas?.length
					? "Sus mascotas quedan registradas, pero sin dueño asignado."
					: "No tiene mascotas asignadas.",
			})
			.subscribe((confirmado) => {
				if (!confirmado) return
				this.loading = true
				this._dueñoService.deleteDueño(this.id).subscribe({
					next: () => {
						this._sbService.mostrarMensajeExitoso("Dueño borrado")
						this._router.navigate(["/duenos"])
					},
					error: () => (this.loading = false),
				})
			})
	}
}
