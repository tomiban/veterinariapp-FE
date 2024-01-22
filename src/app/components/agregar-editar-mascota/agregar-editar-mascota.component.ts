import { NgStyle } from "@angular/common"
import { Component } from "@angular/core"
import { MatCardModule } from "@angular/material/card"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatGridListModule } from "@angular/material/grid-list"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { RouterLink } from "@angular/router"
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms"
import { Mascota } from "../../interfaces/mascota"

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
	],
	templateUrl: "./agregar-editar-mascota.component.html",
	styleUrl: "./agregar-editar-mascota.component.css",
})
export class AgregarEditarMascotaComponent {
	isVerMascota: boolean = true
	loading: boolean = false
	form: FormGroup

	constructor(private fb: FormBuilder) {
		this.form = this.fb.group({
			nombre: ["", Validators.required],
			color: ["", Validators.required],
			raza: ["", Validators.required],
			edad: ["", Validators.required, Validators.pattern(/^[0-9]+$/)],
			peso: ["", [Validators.required, Validators.pattern(/^[0-9]+$/)]],
		})
	}
	agregarMascota() {
		const { nombre, color, raza, peso, edad } = this.form.value

		const mascota: Mascota = {
			nombre,
			color,
			raza,
			edad,
			peso,
		}
	}
}
