import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core"
import { RouterLink } from "@angular/router"
import { MatTableDataSource, MatTableModule } from "@angular/material/table"
import { Mascota } from "../../../interfaces/mascota"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { MatSort, MatSortModule } from "@angular/material/sort"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MascotaService } from "../../../services/mascota.service"
import { SnackbarService } from "../../../services/snackbar.service"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { capitalizeFirst } from "../../../utils/utils"
import { EspecieAnimal } from "../../../constants/enums/especies.enum"

@Component({
	selector: "app-listado-mascota",
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
		MatSnackBarModule,
	],
	templateUrl: "./listado-mascota.component.html",
	styleUrl: "./listado-mascota.component.css",
})
export class ListadoMascotaComponent implements OnInit {
	displayedColumns: string[] = [
		"nro",
		"nombre",
		"especie",
		"raza",
		"color",
		"edad",
		"peso",
		"acciones",
	]
	dataSource = new MatTableDataSource<Mascota>()
	loading: boolean = false

	@ViewChild(MatPaginator) paginator!: MatPaginator
	@ViewChild(MatSort) sort!: MatSort

	constructor(
		private _mascotaService: MascotaService,
		private _notificacionService: SnackbarService,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.obtenerMascotas()
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.dataSource.filter = filterValue.trim().toLowerCase()

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage()
		}
	}

	obtenerMascotas() {
		this.loading = true
		this._mascotaService.getMascotas().subscribe({
			next: (data) => {
				this.dataSource.data = data.map((mascota, index) => {
					return {
						...mascota,
						especie: mascota.especie
							? (capitalizeFirst(mascota.especie) as EspecieAnimal)
							: undefined,
						nro: index + 1,
					}
				})

				this.dataSource.paginator = this.paginator
				this.dataSource.sort = this.sort
				this.paginator._intl.itemsPerPageLabel = "Mascotas por página"
			},
			error: (e) => {
				this.loading = false
				alert(`Servidor caido: ${e.message}`)
			},
			complete: () => {
				this.loading = false
			},
		})
	}

	eliminarMascota(event: MouseEvent, id: number) {
		this.loading = true
		event.stopPropagation()

		this._mascotaService.deleteMascota(id).subscribe({
			next: () => {
				this._notificacionService.mostrarMensajeExitoso(
					"¡Mascota eliminada con éxito!"
				)
				this.obtenerMascotas()
			},
			error: (error) => {
				this._notificacionService.mostrarMensajeExitoso("¡Error!")
			},
			complete: () => {
				this.loading = false
			},
		})
	}
}
