import { AsyncPipe, NgStyle } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { MatCardModule } from "@angular/material/card"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatGridListModule } from "@angular/material/grid-list"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms"
import { Mascota } from "../../../interfaces/mascota"
import { MascotaService } from "../../../services/mascota.service"
import { SnackbarService } from "../../../services/snackbar.service"
import { MatSelectModule } from "@angular/material/select"
import { SelectSexo } from "../../../interfaces/selectSexo"
import { Dueño } from "../../../interfaces/dueño"

@Component({
	selector: "app-agregar-editar-mascota",
	standalone: true,
	imports: [
		NgStyle,
		MatProgressBarModule,
		MatCardModule,
		MatGridListModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatIconModule,
		MatButtonModule,
		RouterLink,
		ReactiveFormsModule,
		AsyncPipe,
		FormsModule,
	],
	templateUrl: "./agregar-editar-mascota.component.html",
	styleUrl: "./agregar-editar-mascota.component.css",
})
export class AgregarEditarMascotaComponent implements OnInit {
	isVerMascota: boolean = true
	loading: boolean = false
	form: FormGroup
	id: number
	titulo: string
	selectedValue!: string

	sexos: SelectSexo[] = [
		{ value: "Macho", viewValue: "Macho" },
		{ value: "Hembra", viewValue: "Hembra" },
	]

	constructor(
		private fb: FormBuilder,
		private _mascotaService: MascotaService,
		private _sbService: SnackbarService,
		private _router: Router,
		private aRoute: ActivatedRoute
	) {
		this.titulo = "Registrar "

		this.form = this.fb.group({
			nombre: ["", Validators.required],
			especie: ["", Validators.required],
			sexo: ["Macho", Validators.required],
			color: ["", Validators.required],
			raza: ["", Validators.required],
			edad: ["", Validators.required],
			peso: ["", Validators.required],
			nombreDueño: ["", Validators.required],
			telefono: ["", Validators.required],
			domicilio: ["", Validators.required],
		})
		this.id = Number(this.aRoute.snapshot.paramMap.get("idMascota"))
	}

	ngOnInit(): void {
		if (this.id != 0) {
			this.titulo = "Editar "
			this.obtenerMascota(this.id)
		}
	}

	obtenerMascota(id: number) {
		this._mascotaService.getMascota(id).subscribe({
			next: (mascota: Mascota) => {
				console.log(mascota.dueño?.telefono)

				this.form.patchValue({
					nombre: mascota.nombre,
					especie: mascota.especie,
					sexo: mascota.sexo,
					color: mascota.color,
					raza: mascota.raza,
					peso: mascota.peso,
					edad: mascota.edad,
					nombreDueño: mascota.dueño?.nombre,
					telefono: mascota.dueño?.telefono,
					domicilio: mascota.dueño?.domicilio,
				})

      console.log(this.form.value);


			},
			error: () => {},
			complete: () => {},
		})
	}

	agregarMascota(mascota: Mascota, dueño: Dueño) {
		this._mascotaService.addMascota(mascota).subscribe({
			next: (mascota) => {
				this.loading = true
				console.log(mascota, mascota.id)

				if (mascota.id) {
					const mascotaId: number = mascota.id
					this._mascotaService.addDueño(mascotaId, dueño).subscribe((data) => {
						console.log(data)
					})
				}
			},
			error: (error) => {
				if (error) console.log(error)
			},
			complete: () => {
				this.loading = false
				this._router.navigate(["/listado-mascota"])
				this._sbService.mostrarMensajeExitoso("Mascota  registrada  con éxito")
			},
		})
	}

	editarMascota(id: number, mascota: Mascota) {
		this._mascotaService.editMascota(id, mascota).subscribe({
			next: (data) => {
				this.loading = true
			},
			error: (error) => {
				if (error) console.log(error)
			},
			complete: () => {
				this.loading = false
				this._router.navigate(["/listado-mascota"])
				this._sbService.mostrarMensajeExitoso("Mascota actualizada con éxito")
			},
		})
	}

	agregarEditarMascota() {
		const {
			nombre,
			especie,
			color,
			raza,
			peso,
			edad,
			sexo,
			nombreDueño,
			domicilio,
			telefono,
		} = this.form.value

		const mascota: Mascota = {
			nombre,
			especie,
			sexo,
			color,
			raza,
			edad,
			peso,
		}

		const dueño: Dueño = {
			nombre: nombreDueño,
			telefono,
			domicilio,
		}

		console.log(dueño)

		if (this.id != 0) {
			this.editarMascota(this.id, mascota)
		} else {
			this.agregarMascota(mascota, dueño)
		}
	}
}
