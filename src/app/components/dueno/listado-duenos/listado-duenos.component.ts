import { Component, OnInit, ViewChild } from "@angular/core"
import { Router, RouterLink } from "@angular/router"
import { MatTableDataSource, MatTableModule } from "@angular/material/table"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { MatSort, MatSortModule } from "@angular/material/sort"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { Dueño } from "../../../interfaces/dueño"
import { DueñoService } from "../../../services/dueno.service"
import { SnackbarService } from "../../../services/snackbar.service"
import { ConfirmacionService } from "../../../services/confirmacion.service"
import { EstadoVacioComponent } from "../../shared/estado-vacio.component"

@Component({
	selector: "app-listado-duenos",
	standalone: true,
	imports: [
		RouterLink,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatInputModule,
		MatFormFieldModule,
		MatIconModule,
		MatTooltipModule,
		MatButtonModule,
		MatProgressBarModule,
		EstadoVacioComponent,
	],
	templateUrl: "./listado-duenos.component.html",
})
export class ListadoDuenosComponent implements OnInit {
	displayedColumns: string[] = ["nombre", "telefono", "domicilio", "cantidadMascotas", "acciones"]
	dataSource = new MatTableDataSource<Dueño>()
	loading = false
	error = false
	busqueda = ""

	@ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
		this.dataSource.paginator = paginator
	}
	@ViewChild(MatSort) set sort(sort: MatSort) {
		this.dataSource.sort = sort
	}

	constructor(
		private _dueñoService: DueñoService,
		private _sbService: SnackbarService,
		private _confirmacion: ConfirmacionService,
		private _router: Router
	) {
		this.dataSource.filterPredicate = (dueño, filtro) =>
			[dueño.nombre, dueño.telefono, dueño.domicilio].some((valor) =>
				(valor ?? "").toLowerCase().includes(filtro)
			)
	}

	ngOnInit(): void {
		this.obtenerRegistros()
	}

	get hayRegistros(): boolean {
		return this.dataSource.data.length > 0
	}

	aplicarFiltro(event: Event) {
		this.busqueda = (event.target as HTMLInputElement).value
		this.dataSource.filter = this.busqueda.trim().toLowerCase()
		this.dataSource.paginator?.firstPage()
	}

	obtenerRegistros() {
		this.loading = true
		this.error = false
		this._dueñoService.getDueños().subscribe({
			next: (dueños) => {
				this.dataSource.data = dueños
				this.loading = false
			},
			error: () => {
				this.error = true
				this.loading = false
			},
		})
	}

	ver(dueño: Dueño) {
		this._router.navigate(["/duenos", dueño.id])
	}

	eliminar(event: MouseEvent, dueño: Dueño) {
		event.stopPropagation()
		const mascotas = dueño.cantidadMascotas ?? 0
		this._confirmacion
			.confirmar({
				titulo: `¿Borrar a ${dueño.nombre}?`,
				mensaje: mascotas
					? `Sus ${mascotas === 1 ? "mascota queda" : mascotas + " mascotas quedan"} registradas, pero sin dueño asignado.`
					: "No tiene mascotas asignadas.",
			})
			.subscribe((confirmado) => {
				if (!confirmado || !dueño.id) return
				this.loading = true
				this._dueñoService.deleteDueño(dueño.id).subscribe({
					next: () => {
						this._sbService.mostrarMensajeExitoso("Dueño borrado")
						this.obtenerRegistros()
					},
					error: () => (this.loading = false),
				})
			})
	}
}
