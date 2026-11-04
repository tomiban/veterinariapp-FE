import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { Dueño } from "../../../interfaces/dueño"
import { DueñoService } from "../../../services/dueno.service"
import { SnackbarService } from "../../../services/snackbar.service"

@Component({
	selector: "app-agregar-editar-dueno",
	standalone: true,
	imports: [
		RouterLink,
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		MatProgressBarModule,
	],
	templateUrl: "./agregar-editar-dueno.component.html",
})
export class AgregarEditarDuenoComponent implements OnInit {
	loading = false
	form: FormGroup
	id: number
	titulo: string

	constructor(
		private fb: FormBuilder,
		private _dueñoService: DueñoService,
		private _sbService: SnackbarService,
		private _router: Router,
		private aRoute: ActivatedRoute
	) {
		this.form = this.fb.group({
			nombre: ["", [Validators.required, Validators.maxLength(100)]],
			telefono: ["", [Validators.maxLength(30), Validators.pattern(/^[0-9+()\-\s]*$/)]],
			domicilio: ["", Validators.maxLength(150)],
		})
		this.id = Number(this.aRoute.snapshot.paramMap.get("idDueno"))
		this.titulo = this.id ? "Editar dueño" : "Nuevo dueño"
	}

	ngOnInit(): void {
		if (this.id) {
			this.loading = true
			this._dueñoService.getDueño(this.id).subscribe({
				next: (dueño) => {
					this.form.patchValue(dueño)
					this.loading = false
				},
				error: () => (this.loading = false),
			})
		}
	}

	guardar() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			return
		}
		const { nombre, telefono, domicilio } = this.form.value
		const dueño: Dueño = {
			nombre: nombre.trim(),
			telefono: telefono?.trim() || null,
			domicilio: domicilio?.trim() || null,
		}

		this.loading = true
		const pedido = this.id
			? this._dueñoService.editDueño(this.id, dueño)
			: this._dueñoService.addDueño(dueño)

		pedido.subscribe({
			next: (guardado) => {
				this.loading = false
				this._sbService.mostrarMensajeExitoso(this.id ? "Dueño actualizado" : "Dueño registrado")
				this._router.navigate(["/duenos", guardado.id])
			},
			error: () => (this.loading = false),
		})
	}
}
