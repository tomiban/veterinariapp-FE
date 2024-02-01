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
import { EspecieAnimal } from "../../../constants/enums/especies.enum"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { Vacuna } from "../../../interfaces/vacunas"
import { MatIconModule } from "@angular/material/icon"
import { MatTooltipModule } from "@angular/material/tooltip"
import { VacunaService } from "../../../services/vacuna.service"
import { animate, state, style, transition, trigger } from "@angular/animations"

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
	id: number
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
		private _vacunaService: VacunaService
	) {
		this.id = Number(this.aRoute.snapshot.paramMap.get(`id`))
	}

	ngOnInit(): void {
		this.obtenerVacunas(this.id)
		this.mascota$ = this._mascotaService.getMascota(this.id)

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
	}

	handleToggle() {
		this.deuda = !this.deuda
	}

	obtenerRutaImagen(especie: string): string {
		// Lógica para determinar la ruta de la imagen según el tipo de mascota
		switch (especie) {
			case EspecieAnimal.GATO:
				return "../../../assets/img/cat.png"
			case EspecieAnimal.PERRO:
				return "../../../assets/img/dog.png"
			case EspecieAnimal.ROEDOR:
				return "../../../assets/img/squirrel.png"
			case EspecieAnimal.CONEJO:
				return "../../../assets/img/rabbit.png"
			// Agrega más casos según sea necesario
			default:
				return "../../../assets/img/dog.png" // Puedes establecer una imagen predeterminada o una ruta vacía si no hay coincidencia
		}
	}

	obtenerVacunas(id: number) {
		this.loading = true
		this._vacunaService.getVacuna(id).subscribe({
			next: (data) => {
				this.dataSource.data = data.map((vacuna, index) => {
					return {
						Nro: index + 1,
						Nombre: vacuna.nombre,
						Cantidad: vacuna.cantidadDosis,
						Completada: vacuna.completada,
						Id: vacuna.id,
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
}
