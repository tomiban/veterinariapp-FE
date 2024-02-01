import { AsyncPipe, NgStyle } from "@angular/common"
import { Component } from "@angular/core"
import {
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
	],
	providers: [],
	templateUrl: "./agregar-editar-vacuna.component.html",
	styleUrl: "./agregar-editar-vacuna.component.css",
})
export class AgregarEditarVacunaComponent {
	isVacuna: boolean = true
	loading: boolean = false
	form: FormGroup
	id: number
	titulo: string

	constructor(
		private fb: FormBuilder,
		private _sbService: SnackbarService,
		private _router: Router,
		private aRoute: ActivatedRoute,
		private _vacunaService: VacunaService,
		private _dosisService: DosisService
	) {
		this.titulo = "Registrar "
		this.form = this.fb.group({
			nombre: ["", Validators.required],
			cantidadDosis: ["", Validators.required],
			fechaAplicacion: ["", [Validators.required]],
			fechaProximaAplicacion: [""],
		})

		this.id = Number(this.aRoute.snapshot.paramMap.get("id"))
	}

	agregarEditarVacuna() {
		const { nombre, cantidadDosis, fechaAplicacion, fechaProximaAplicacion } =
			this.form.value

		const vacuna: Vacuna = {
			nombre,
			cantidadDosis,
			completada: cantidadDosis < 2,
		}

		console.log(vacuna)

		this._vacunaService.addVacuna(this.id, vacuna).subscribe({
			next: (vacuna: Vacuna) => {
				this.loading = true
				const vacunaId = vacuna.id as number
				const dosis: Dosis = {
					fechaAplicacion,
					fechaProximaAplicacion,
				}
				this._dosisService.addDosis(this.id, vacunaId, dosis).subscribe({
					next: (data) => console.log(data),
					error: (err) => console.log(err),
				})
			},
			error: (error) => {
				if (error) console.log(error)
			},
			complete: () => {
				this.loading = false
				this._router.navigate(["/listado-mascota"])
				this._sbService.mostrarMensajeExitoso("Vacuna registrada  con éxito")
			},
		})
	}
}
