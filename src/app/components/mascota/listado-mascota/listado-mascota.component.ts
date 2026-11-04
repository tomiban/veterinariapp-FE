import { Component, OnInit, ViewChild } from "@angular/core"
import { DecimalPipe } from "@angular/common"
import { Router, RouterLink } from "@angular/router"
import { MatTableDataSource, MatTableModule } from "@angular/material/table"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { MatSort, MatSortModule } from "@angular/material/sort"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSelectModule } from "@angular/material/select"
import { MatIconModule } from "@angular/material/icon"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { Mascota } from "../../../interfaces/mascota"
import { MascotaService } from "../../../services/mascota.service"
import { SnackbarService } from "../../../services/snackbar.service"
import { ConfirmacionService } from "../../../services/confirmacion.service"
import { EstadoVacioComponent } from "../../shared/estado-vacio.component"
import { ESPECIES, obtenerRutaImagen } from "../../../constants/especies"

interface Filtro {
	texto: string
	especie: string
}

@Component({
	selector: "app-listado-mascota",
	standalone: true,
	imports: [
		DecimalPipe,
		RouterLink,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		MatIconModule,
		MatTooltipModule,
		MatButtonModule,
		MatProgressBarModule,
		EstadoVacioComponent,
	],
	templateUrl: "./listado-mascota.component.html",
	styleUrl: "./listado-mascota.component.css",
})
export class ListadoMascotaComponent implements OnInit {
	displayedColumns: string[] = ["nombre", "especie", "sexo", "raza", "edad", "peso", "dueño", "acciones"]
	dataSource = new MatTableDataSource<Mascota>()
	loading = false
	error = false
	especies = ESPECIES
	filtro: Filtro = { texto: "", especie: "" }
	obtenerRutaImagen = obtenerRutaImagen

	@ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
		this.dataSource.paginator = paginator
	}
	@ViewChild(MatSort) set sort(sort: MatSort) {
		this.dataSource.sort = sort
	}

	constructor(
		private _mascotaService: MascotaService,
		private _sbService: SnackbarService,
		private _confirmacion: ConfirmacionService,
		private _router: Router
	) {
		// El filtro viaja como JSON para combinar texto libre y especie.
		this.dataSource.filterPredicate = (mascota, filtroJson) => {
			const { texto, especie }: Filtro = JSON.parse(filtroJson)
			const coincideEspecie = !especie || mascota.especie === especie
			const coincideTexto =
				!texto ||
				[mascota.nombre, mascota.raza, mascota.color, mascota.dueño?.nombre].some((valor) =>
					(valor ?? "").toLowerCase().includes(texto)
				)
			return coincideEspecie && coincideTexto
		}
		this.dataSource.sortingDataAccessor = (mascota, columna) =>
			columna === "dueño" ? mascota.dueño?.nombre ?? "" : (mascota as any)[columna]
	}

	ngOnInit(): void {
		this.obtenerMascotas()
	}

	get hayMascotas(): boolean {
		return this.dataSource.data.length > 0
	}

	aplicarFiltro(cambios: Partial<Filtro>) {
		this.filtro = { ...this.filtro, ...cambios }
		this.dataSource.filter = JSON.stringify({
			texto: this.filtro.texto.trim().toLowerCase(),
			especie: this.filtro.especie,
		})
		this.dataSource.paginator?.firstPage()
	}

	textoDeBusqueda(event: Event): string {
		return (event.target as HTMLInputElement).value
	}

	obtenerMascotas() {
		this.loading = true
		this.error = false
		this._mascotaService.getMascotas().subscribe({
			next: (data) => {
				this.dataSource.data = data
				this.loading = false
			},
			error: () => {
				this.error = true
				this.loading = false
			},
		})
	}

	verMascota(mascota: Mascota) {
		this._router.navigate(["/mascotas", mascota.id])
	}

	eliminarMascota(event: MouseEvent, mascota: Mascota) {
		event.stopPropagation()
		this._confirmacion
			.confirmar({
				titulo: `¿Borrar a ${mascota.nombre}?`,
				mensaje: "Se borran también sus vacunas y dosis registradas. No se puede deshacer.",
			})
			.subscribe((confirmado) => {
				if (!confirmado || !mascota.id) return
				this.loading = true
				this._mascotaService.deleteMascota(mascota.id).subscribe({
					next: () => {
						this._sbService.mostrarMensajeExitoso("Mascota borrada")
						this.obtenerMascotas()
					},
					error: () => (this.loading = false),
				})
			})
	}
}
