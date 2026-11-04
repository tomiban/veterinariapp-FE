import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { Mascota } from "../../../interfaces/mascota"
import { Dueño } from "../../../interfaces/dueño"
import { MascotaService } from "../../../services/mascota.service"
import { DueñoService } from "../../../services/dueno.service"
import { SnackbarService } from "../../../services/snackbar.service"
import { ESPECIES, SEXOS } from "../../../constants/especies"

@Component({
	selector: "app-agregar-editar-mascota",
	standalone: true,
	imports: [
		MatProgressBarModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatIconModule,
		MatButtonModule,
		RouterLink,
		ReactiveFormsModule,
	],
	templateUrl: "./agregar-editar-mascota.component.html",
})
export class AgregarEditarMascotaComponent implements OnInit {
	loading = false
	form: FormGroup
	id: number
	titulo: string
	especies = ESPECIES
	sexos = SEXOS
	responsables: Dueño[] = []

	constructor(
		private fb: FormBuilder,
		private _mascotaService: MascotaService,
		private _dueñoService: DueñoService,
		private _sbService: SnackbarService,
		private _router: Router,
		private aRoute: ActivatedRoute
	) {
		// Mismos límites que valida la API (CreateMascotaDto).
		this.form = this.fb.group({
			nombre: ["", [Validators.required, Validators.maxLength(50)]],
			especie: ["", Validators.required],
			sexo: ["Macho", Validators.required],
			raza: ["", [Validators.required, Validators.maxLength(50)]],
			color: ["", [Validators.required, Validators.maxLength(50)]],
			edad: [null, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern(/^\d+$/)]],
			peso: [null, [Validators.required, Validators.min(0.1), Validators.max(1000)]],
			dueñoId: [null],
		})
		this.id = Number(this.aRoute.snapshot.paramMap.get("idMascota"))
		this.titulo = this.id ? "Editar mascota" : "Nueva mascota"

		// Desde la ficha de un dueño se llega con ?dueno=ID para dejarlo preseleccionado.
		const dueñoPreseleccionado = Number(this.aRoute.snapshot.queryParamMap.get("dueno"))
		if (dueñoPreseleccionado) this.form.patchValue({ dueñoId: dueñoPreseleccionado })
	}

	get volverA(): any[] {
		const dueño = this.aRoute.snapshot.queryParamMap.get("dueno")
		if (this.id) return ["/mascotas", this.id]
		return dueño ? ["/duenos", dueño] : ["/mascotas"]
	}

	ngOnInit(): void {
		this._dueñoService.getDueños().subscribe((dueños) => (this.responsables = dueños))

		if (this.id) {
			this.loading = true
			this._mascotaService.getMascota(this.id).subscribe({
				next: (mascota: Mascota) => {
					this.form.patchValue({ ...mascota, dueñoId: mascota.dueñoId ?? null })
					this.loading = false
				},
				error: () => (this.loading = false),
			})
		}
	}

	error(campo: string, tipo: string): boolean {
		return !!this.form.get(campo)?.hasError(tipo)
	}

	guardar() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			return
		}
		const valores = this.form.value
		const mascota: Mascota = {
			nombre: valores.nombre.trim(),
			especie: valores.especie,
			sexo: valores.sexo,
			raza: valores.raza.trim(),
			color: valores.color.trim(),
			edad: Number(valores.edad),
			peso: Number(valores.peso),
			dueñoId: valores.dueñoId,
		}

		this.loading = true
		const pedido = this.id
			? this._mascotaService.editMascota(this.id, mascota)
			: this._mascotaService.addMascota(mascota)

		pedido.subscribe({
			next: (guardada) => {
				this.loading = false
				this._sbService.mostrarMensajeExitoso(this.id ? "Mascota actualizada" : "Mascota registrada")
				this._router.navigate(["/mascotas", guardada.id])
			},
			error: () => (this.loading = false),
		})
	}
}
