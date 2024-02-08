import { AsyncPipe, CommonModule, Location, NgStyle } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import {
	FormArray,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatGridListModule } from "@angular/material/grid-list"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { SnackbarService } from "../../../services/snackbar.service"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { MatInputModule } from "@angular/material/input"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule, NativeDateAdapter } from "@angular/material/core"
import { Vacuna } from "../../../interfaces/vacunas"
import { Dosis } from "../../../interfaces/dosis"
import { VacunaService } from "../../../services/vacuna.service"
import { DosisService } from "../../../services/dosis.service"

@Component({
	selector: "app-agregar-editar-vacuna",
	standalone: true,
	imports: [
		NgStyle,
		MatProgressBarModule,
		MatCardModule,
		MatGridListModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		RouterLink,
		ReactiveFormsModule,
		AsyncPipe,
		MatDatepickerModule,
		MatNativeDateModule,
		CommonModule,
	],
	providers: [],
	templateUrl: "./agregar-editar-vacuna.component.html",
	styleUrl: "./agregar-editar-vacuna.component.css",
})
export class AgregarEditarVacunaComponent implements OnInit {
	isVacuna: boolean = true
	loading!: boolean
	form!: FormGroup
	idMascota!: number
	idVacuna!: number
	titulo!: string
	currentDoseIndex!: number
	esParaCrearDosis: boolean = false
	esParaEditarVacuna: boolean = false
	esParaCrearVacuna: boolean = false

	constructor(
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private _sbService: SnackbarService,
		private aRoute: ActivatedRoute,
		private _vacunaService: VacunaService,
		private _dosisService: DosisService,
		private location: Location
	) {
		this.form = this.fb.group({
			nombre: ["", Validators.required],
			cantidadDosis: ["", Validators.required],
			dosificaciones: this.fb.array([]),
		})
	}

	ngOnInit(): void {
		this.idMascota = Number(this.route.snapshot.paramMap.get("idMascota"))
		this.idVacuna = Number(this.route.snapshot.paramMap.get("idVacuna"))
		this.detectarTipoRuta()
		this.inicializarFormulario()
	}

	private inicializarFormulario(): void {
		if (this.esParaEditarVacuna) {
			this.titulo = "Editar "
			this.cargarDatosVacuna()
		} else if (this.esParaCrearDosis) {
			this.titulo = "Añadir dosis a la "
			this.form = this.fb.group({
				fechaAplicacion: ["", [Validators.required]],
				fechaProximaAplicacion: [""],
			})
		} else {
			this.titulo = "Agregar "
			this.form = this.fb.group({
				nombre: ["", Validators.required],
				cantidadDosis: ["", Validators.required],
				fechaAplicacion: ["", [Validators.required]],
				fechaProximaAplicacion: [""],
			})
		}
	}

	private detectarTipoRuta(): void {
		this.route.url.subscribe((segments) => {
			const segmentos = segments.map((seg) => seg.path)
			if (segmentos.includes("dosis")) {
				this.esParaCrearDosis = true
			} else if (segmentos.includes("editar")) {
				this.esParaEditarVacuna = true
			} else {
				this.esParaCrearVacuna = true
			}
		})
	}

	cargarDatosVacuna() {
		this.loading = true
		this._vacunaService.getVacuna(this.idMascota, this.idVacuna).subscribe({
			next: (vacuna) => {
				this.actualizarFormularioConVacuna(vacuna)
				this.loading = false
			},
			error: (error) => {
				console.error("Error al cargar los datos de la vacuna:", error)
				this.loading = false
			},
		})
	}

	private actualizarFormularioConVacuna(vacuna: Vacuna): void {
		this.form.patchValue({
			nombre: vacuna.nombre,
			cantidadDosis: vacuna.cantidadDosis,
    })
    
		this.actualizarDosificaciones(vacuna.dosificaciones)
	}

	get dosificaciones() {
		return this.form.get("dosificaciones") as FormArray
	}

	private actualizarDosificaciones(dosificaciones?: Dosis[]): void {
		const dosificacionesFormArray = this.form.get("dosificaciones") as FormArray
		dosificacionesFormArray.clear()
		dosificaciones?.forEach((dosis) => {
			dosificacionesFormArray.push(
				this.fb.group({
					id: [dosis.id],
					fechaAplicacion: [dosis.fechaAplicacion],
					fechaProximaAplicacion: [dosis.fechaProximaAplicacion],
				})
			)
		})
	}

	crearVacuna(event: Event) {
		const { nombre, cantidadDosis, fechaAplicacion, fechaProximaAplicacion } =
			this.form.value

		const vacuna: Vacuna = {
			nombre,
			cantidadDosis,
			completada: cantidadDosis < 2,
		}

		this._vacunaService.addVacuna(this.idMascota, vacuna).subscribe({
			next: (vacuna: Vacuna) => {
				const vacunaId = vacuna.id as number
				const dosis: Dosis = {
					fechaAplicacion,
					fechaProximaAplicacion,
				}

				this._dosisService.addDosis(this.idMascota, vacunaId, dosis).subscribe({
					next: (data) => console.log(data),
					error: (err) => {
						console.log(err)
						this.loading = false // Establecer loading a false en caso de error
					},
					complete: () => {
						this.loading = false
						this._sbService.mostrarMensajeExitoso("Vacuna registrada con éxito")
						this.volver(event) // Redirigir después de que se haya completado toda la operación
					},
				})
			},
			error: (error) => {
				if (error) {
					console.log(error)
					this.loading = false // Establecer loading a false en caso de error
				}
			},
			complete: () => {
				this.loading = false
			},
		})
	}

	añadirDosis(event: Event) {
		const { fechaAplicacion, fechaProximaAplicacion } = this.form.value

		const dosis: Dosis = {
			fechaAplicacion,
			fechaProximaAplicacion,
		}

		this._dosisService
			.addDosis(this.idMascota, this.idVacuna, dosis)
			.subscribe({
				next: (data) => {
					this.loading = false
				},
				error: (error: any) => {
					if (error) console.log(error)
					this.loading = false // Establecer loading a false en caso de error
				},
				complete: () => {
					this.loading = false
					this._sbService.mostrarMensajeExitoso("Dosis añadida con éxito")
					this.volver(event) // Redirigir después de que se haya completado toda la operación
				},
			})
	}

	editarVacuna(event: Event) {
		const { nombre, cantidadDosis, dosificaciones } = this.form.value

		const vacuna: Vacuna = {
			nombre,
			cantidadDosis,
			completada: cantidadDosis < 2,
			dosificaciones,
		}

		console.log(vacuna)

		this._vacunaService
			.editVacuna(this.idMascota, this.idVacuna, vacuna)
			.subscribe({
				next: (vacuna: Vacuna) => {
					console.log(vacuna)
				},
				error: (error) => {
					if (error) {
						console.log(error)
						this.loading = false // Establecer loading a false en caso de error
					}
				},
				complete: () => {
					this.loading = false
					this._sbService.mostrarMensajeExitoso("Vacuna registrada con éxito")
					this.volver(event) // Redirigir después de que se haya completado toda la operación
				},
			})
	}

	volver(event: Event): void {
		event.preventDefault()
		this.location.back()
	}

	submitForm(event: Event) {
		this.loading = true
		if (this.esParaEditarVacuna) {
			this.editarVacuna(event)
		} else if (this.esParaCrearDosis) {
			this.añadirDosis(event)
		} else {
			this.crearVacuna(event)
		}
	}
}
