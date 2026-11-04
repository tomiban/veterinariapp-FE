import { DatePipe } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from "@angular/forms"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatInputModule } from "@angular/material/input"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { switchMap } from "rxjs"
import { Vacuna } from "../../../interfaces/vacunas"
import { Dosis } from "../../../interfaces/dosis"
import { VacunaService } from "../../../services/vacuna.service"
import { DosisService } from "../../../services/dosis.service"
import { SnackbarService } from "../../../services/snackbar.service"

type Modo = "crear" | "editar" | "dosis"

// La próxima aplicación tiene que ser posterior a la que se está registrando.
const proximaPosterior: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
	const aplicacion = grupo.get("fechaAplicacion")?.value
	const proxima = grupo.get("fechaProximaAplicacion")?.value
	if (!aplicacion || !proxima) return null
	return new Date(proxima) > new Date(aplicacion) ? null : { proximaAnterior: true }
}

@Component({
	selector: "app-agregar-editar-vacuna",
	standalone: true,
	imports: [
		DatePipe,
		MatProgressBarModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		RouterLink,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatNativeDateModule,
	],
	templateUrl: "./agregar-editar-vacuna.component.html",
})
export class AgregarEditarVacunaComponent implements OnInit {
	loading = false
	form!: FormGroup
	modo: Modo = "crear"
	idMascota: number
	idVacuna: number
	vacuna?: Vacuna
	hoy = new Date()

	constructor(
		private route: ActivatedRoute,
		private _router: Router,
		private fb: FormBuilder,
		private _sbService: SnackbarService,
		private _vacunaService: VacunaService,
		private _dosisService: DosisService
	) {
		this.idMascota = Number(this.route.snapshot.paramMap.get("idMascota"))
		this.idVacuna = Number(this.route.snapshot.paramMap.get("idVacuna"))
		const segmentos = this.route.snapshot.url.map((segmento) => segmento.path)
		if (segmentos.includes("dosis")) this.modo = "dosis"
		else if (segmentos.includes("editar")) this.modo = "editar"
	}

	get titulo(): string {
		if (this.modo === "dosis") return "Registrar dosis"
		return this.modo === "editar" ? "Editar vacuna" : "Nueva vacuna"
	}

	get dosisAplicadas(): number {
		return this.vacuna?.dosificaciones?.length ?? 0
	}

	ngOnInit(): void {
		this.inicializarFormulario()
		if (this.modo !== "crear") this.cargarVacuna()
	}

	private inicializarFormulario(): void {
		const fechas = {
			fechaAplicacion: [null as Date | null, Validators.required],
			fechaProximaAplicacion: [null as Date | null, Validators.required],
		}
		const datosVacuna = {
			nombre: ["", [Validators.required, Validators.maxLength(50)]],
			cantidadDosis: [1, [Validators.required, Validators.min(1), Validators.max(99), Validators.pattern(/^\d+$/)]],
		}

		if (this.modo === "editar") this.form = this.fb.group(datosVacuna)
		else if (this.modo === "dosis") this.form = this.fb.group(fechas, { validators: proximaPosterior })
		else this.form = this.fb.group({ ...datosVacuna, ...fechas }, { validators: proximaPosterior })
	}

	private cargarVacuna() {
		this.loading = true
		this._vacunaService.getVacuna(this.idMascota, this.idVacuna).subscribe({
			next: (vacuna) => {
				this.vacuna = vacuna
				if (this.modo === "editar") {
					this.form.patchValue({ nombre: vacuna.nombre, cantidadDosis: vacuna.cantidadDosis })
					// No se puede bajar la cantidad por debajo de las dosis ya aplicadas.
					this.form
						.get("cantidadDosis")
						?.addValidators(Validators.min(Math.max(1, this.dosisAplicadas)))
					this.form.get("cantidadDosis")?.updateValueAndValidity()
				}
				this.loading = false
			},
			error: () => (this.loading = false),
		})
	}

	error(campo: string, tipo: string): boolean {
		return !!this.form.get(campo)?.hasError(tipo)
	}

	private dosisDelFormulario(): Dosis {
		const { fechaAplicacion, fechaProximaAplicacion } = this.form.value
		return { fechaAplicacion, fechaProximaAplicacion }
	}

	guardar() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			return
		}
		this.loading = true

		if (this.modo === "dosis") {
			this._dosisService.addDosis(this.idMascota, this.idVacuna, this.dosisDelFormulario()).subscribe({
				next: () => this.terminar("Dosis registrada"),
				error: () => (this.loading = false),
			})
			return
		}

		const vacuna: Vacuna = {
			nombre: this.form.value.nombre.trim(),
			cantidadDosis: Number(this.form.value.cantidadDosis),
			// El estado real lo recalcula la API según las dosis aplicadas.
			completada: false,
		}

		if (this.modo === "editar") {
			this._vacunaService.editVacuna(this.idMascota, this.idVacuna, vacuna).subscribe({
				next: () => this.terminar("Vacuna actualizada"),
				error: () => (this.loading = false),
			})
			return
		}

		// Alta: se crea la vacuna y enseguida su primera dosis.
		this._vacunaService
			.addVacuna(this.idMascota, vacuna)
			.pipe(switchMap((creada) => this._dosisService.addDosis(this.idMascota, creada.id as number, this.dosisDelFormulario())))
			.subscribe({
				next: () => this.terminar("Vacuna registrada"),
				error: () => (this.loading = false),
			})
	}

	private terminar(mensaje: string) {
		this.loading = false
		this._sbService.mostrarMensajeExitoso(mensaje)
		this._router.navigate(["/mascotas", this.idMascota])
	}
}
