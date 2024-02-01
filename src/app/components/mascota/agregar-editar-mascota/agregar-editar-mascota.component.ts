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
	ReactiveFormsModule,
	Validators,
} from "@angular/forms"
import { Mascota } from "../../../interfaces/mascota"
import { MascotaService } from "../../../services/mascota.service"
import { SnackbarService } from "../../../services/snackbar.service"
import { Observable } from "rxjs"
import {
	capitalizeFirst,
	obtenerEspecieDesdeString,
} from "../../../utils/utils"
import { EspecieAnimal } from "../../../constants/enums/especies.enum"

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
		MatIconModule,
		MatButtonModule,
		RouterLink,
		ReactiveFormsModule,
		AsyncPipe,
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
			color: ["", Validators.required],
			raza: ["", Validators.required],
			edad: ["", Validators.required, Validators.pattern(/^[0-9]+$/)],
			peso: ["", [Validators.required, Validators.pattern(/^[0-9]+$/)]],
		})
		this.id = Number(this.aRoute.snapshot.paramMap.get("id"))
	}

	ngOnInit(): void {
		if (this.id != 0) {
			this.titulo = "Editar "
			this.obtenerMascotas(this.id)
		}
	}

	obtenerMascotas(id: number) {
		this._mascotaService.getMascota(id).subscribe({
			next: (data: Mascota) => {
				this.form.setValue({
					nombre: data.nombre,
					especie: data.especie ? capitalizeFirst(data.especie) : undefined,
					color: data.color,
					raza: data.raza,
					peso: data.peso,
					edad: data.edad,
				})
			},
			error: () => {},
			complete: () => {},
		})
	}

	agregarMascota(mascota: Mascota) {
		this._mascotaService.addMascota(mascota).subscribe({
			next: (data) => {
				this.loading = true
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
		const { nombre, especie, color, raza, peso, edad } = this.form.value

		const especieEnum = obtenerEspecieDesdeString(especie)

		const mascota: Mascota = {
			nombre,
			especie: especieEnum,
			color,
			raza,
			edad,
			peso,
		}

		if (this.id != 0) {
			this.editarMascota(this.id, mascota)
		} else {
			this.agregarMascota(mascota)
		}
	}
}