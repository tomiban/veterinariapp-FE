import { Component, OnInit, ViewChild } from "@angular/core"
import { AsyncPipe, CommonModule, NgIf, NgStyle } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { ActivatedRoute, RouterLink } from "@angular/router"
import { MascotaService } from "../../../services/mascota.service"
import { Mascota } from "../../../interfaces/mascota"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { Observable } from "rxjs"
import { MatChipsModule } from "@angular/material/chips"
import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { MatTabsModule } from "@angular/material/tabs"
import { MatTableDataSource, MatTableModule } from "@angular/material/table"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { Especie } from "../../../constants/enums/especies.enum"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { Vacuna } from "../../../interfaces/vacunas"
import { MatIconModule } from "@angular/material/icon"
import { MatTooltipModule } from "@angular/material/tooltip"
import { VacunaService } from "../../../services/vacuna.service"
import { animate, state, style, transition, trigger } from "@angular/animations"
import { DosisService } from "../../../services/dosis.service"
import { SnackbarService } from "../../../services/snackbar.service"
import { Sexo } from "../../../constants/enums/sexo.enum"

@Component({
	selector: "app-ver-mascota",
	animations: [
		trigger("detailExpand", [
			state("collapsed,void", style({ height: "0px", minHeight: "0" })),
			state("expanded", style({ height: "*" })),
			transition(
				"expanded <=> collapsed",
				animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
			),
		]),
	],
	standalone: true,
	imports: [
		NgStyle,
		MatCardModule,
		MatButtonModule,
		RouterLink,
		MatProgressBarModule,
		NgStyle,
		AsyncPipe,
		MatChipsModule,
		MatSlideToggleModule,
		MatTabsModule,
		MatTableModule,
		MatInputModule,
		MatFormFieldModule,
		MatPaginatorModule,
		MatIconModule,
		MatTooltipModule,
		CommonModule,
		NgIf,
	],
	templateUrl: "./ver-mascota.component.html",
	styleUrl: "./ver-mascota.component.css",
})
export class VerMascotaComponent implements OnInit {
	isVerMascota = true
	loading: boolean = true
	idMascota!: number
	idVacuna!: number
	idDosis!: number
	mascota$!: Observable<Mascota>
	deuda: boolean = false
	expandedElement!: Vacuna | null

	@ViewChild(MatPaginator) paginator!: MatPaginator

	displayedColumns: string[] = [
		"Nro",
		"Nombre",
		"Cantidad",
		"Completada",
		"acciones",
	]

	columnsToDisplayWithExpand = [...this.displayedColumns, "expand"]

	dataSource = new MatTableDataSource()

	constructor(
		private _mascotaService: MascotaService,
		private aRoute: ActivatedRoute,
		private _vacunaService: VacunaService,
		private _dosisService: DosisService,
		private _sbService: SnackbarService
	) {
		this.idMascota = Number(this.aRoute.snapshot.paramMap.get(`idMascota`))
		this.mascota$ = this._mascotaService.getMascota(this.idMascota)
	}

	ngOnInit(): void {
		this.mascota$.subscribe({
			next: (mascota) => {
				// Datos cargados con éxito, establecer loading en false
				this.loading = false
			},
			error: (error) => {
				console.error(error)
				// Ocurrió un error al cargar los datos, establecer loading en false
				this.loading = false
			},
		})

		this.obtenerVacunas(this.idMascota)
	}

	handleToggle() {
		this.deuda = !this.deuda
	}

	// Implementación de la función
	obtenerRutaImagen(parametro: Especie | Sexo): string {
		// Lógica para determinar la ruta de la imagen según el tipo de mascota o sexo
		console.log(parametro)

		switch (parametro) {
			case Especie.GATO:
				return "../../../assets/img/cat.png"
			case Especie.PERRO:
				return "../../../assets/img/dog.png"
			case Especie.ROEDOR:
				return "../../../assets/img/squirrel.png"
			case Especie.CONEJO:
				return "../../../assets/img/rabbit.png"
			case Sexo.MACHO:
				return "../../../assets/img/male-symbol.png"
			case Sexo.HEMBRA:
				return "../../../assets/img/female-symbol.png"
			default:
				return "../../../assets/img/dog.png" // Imagen predeterminada o ruta vacía si no hay coincidencia
		}
	}

	obtenerVacunas(idMascota: number) {
		this.loading = true
		this._vacunaService.getVacunas(idMascota).subscribe({
			next: (data) => {
				this.dataSource.data = data.map((vacuna, index) => {
					return {
						Nro: index + 1,
						Nombre: vacuna.nombre,
						Cantidad: vacuna.cantidadDosis,
						Completada: vacuna.completada,
						id: vacuna.id as number,
						Dosis: vacuna.dosificaciones,
					}
				})
			},
			error: (e) => {
				alert(`Servidor caido: ${e.message}`)
			},
			complete: () => {
				this.dataSource.paginator = this.paginator
				this.paginator._intl.itemsPerPageLabel = "Vacunas por página"
				this.loading = false
			},
		})
	}

	removerVacuna(idVacuna: number) {
		this.loading = true
		this._vacunaService.removeVacuna(this.idMascota, idVacuna).subscribe({
			next: (data) => {
				this.loading = true
			},
			error: (err) => {
				if (err) return console.log(err)
			},
			complete: () => {
				this.loading = false
				this.obtenerVacunas(this.idMascota)
				this._sbService.mostrarMensajeExitoso("Vacuna eliminada con éxito!")
			},
		})
	}

	removerDosis(idDosis: number, idVacuna?: number) {
		if (this.expandedElement) {
			// Guarda el estado de la fila expandida actual
			const filaExpandidaAnterior = this.expandedElement

			this.loading = true
			if (idVacuna && idDosis) {
				this._dosisService
					.removeDosis(this.idMascota, idVacuna, idDosis)
					.subscribe({
						next: () => {
							// Restaura el estado de la fila expandida
							this.expandedElement = filaExpandidaAnterior

							// Maneja la respuesta exitosa
							this.loading = false
							// Vuelve a cargar las vacunas para reflejar los cambios
							this.obtenerVacunas(this.idMascota)
							this._sbService.mostrarMensajeExitoso(
								"Dosis eliminadas con éxito!"
							)
						},
						error: (err) => {
							console.error(err)
							// Manejar el error, si es necesario
							this.loading = false
						},
					})
			}
		}
	}
}
