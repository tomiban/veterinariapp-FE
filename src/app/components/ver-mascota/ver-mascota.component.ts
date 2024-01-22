import { Component, OnInit } from "@angular/core"
import { AsyncPipe, NgStyle } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { ActivatedRoute, RouterLink } from "@angular/router"
import { MascotaService } from "../../services/mascota.service"
import { Mascota } from "../../interfaces/mascota"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { Observable } from "rxjs"
@Component({
	selector: "app-ver-mascota",
	standalone: true,
	imports: [
		NgStyle,
		MatCardModule,
		MatButtonModule,
		RouterLink,
		MatProgressBarModule,
		NgStyle,
		AsyncPipe,
	],
	templateUrl: "./ver-mascota.component.html",
	styleUrl: "./ver-mascota.component.css",
})
export class VerMascotaComponent implements OnInit {
	isVerMascota = true
	loading = false
	id: number
	mascota!: Mascota
	mascota$!: Observable<Mascota>

	constructor(
		private _mascotaService: MascotaService,
		private aRoute: ActivatedRoute
	) {
		this.id = Number(this.aRoute.snapshot.paramMap.get(`id`))
	}

	ngOnInit(): void {
		this.mascota$ = this._mascotaService.getMascota(this.id)
	}

}
