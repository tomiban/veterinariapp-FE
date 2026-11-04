import { Component, OnInit } from "@angular/core"
import { DatePipe, DecimalPipe } from "@angular/common"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatTabsModule } from "@angular/material/tabs"
import { MatIconModule } from "@angular/material/icon"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatMenuModule } from "@angular/material/menu"
import { forkJoin } from "rxjs"
import { Mascota } from "../../../interfaces/mascota"
import { Vacuna } from "../../../interfaces/vacunas"
import { Dosis } from "../../../interfaces/dosis"
import { MascotaService } from "../../../services/mascota.service"
import { VacunaService } from "../../../services/vacuna.service"
import { DosisService } from "../../../services/dosis.service"
import { SnackbarService } from "../../../services/snackbar.service"
import { ConfirmacionService } from "../../../services/confirmacion.service"
import { EstadoVacioComponent } from "../../shared/estado-vacio.component"
import { obtenerRutaImagen } from "../../../constants/especies"

type EstadoVacuna = "completa" | "vencida" | "pendiente" | "sin-dosis"

interface VacunaFicha extends Vacuna {
	dosis: Dosis[]
	aplicadas: number
	proxima: Date | null
	estado: EstadoVacuna
}

interface EntradaHistorial {
	vacuna: VacunaFicha
	dosis: Dosis
	numero: number
}

@Component({
	selector: "app-ver-mascota",
	standalone: true,
	imports: [
		DatePipe,
		DecimalPipe,
		RouterLink,
		MatCardModule,
		MatButtonModule,
		MatProgressBarModule,
		MatTabsModule,
		MatIconModule,
		MatTooltipModule,
		MatMenuModule,
		EstadoVacioComponent,
	],
	templateUrl: "./ver-mascota.component.html",
	styleUrl: "./ver-mascota.component.css",
})
export class VerMascotaComponent implements OnInit {
	loading = true
	idMascota: number
	mascota?: Mascota
	vacunas: VacunaFicha[] = []
	historial: EntradaHistorial[] = []
	proximas: VacunaFicha[] = []
	obtenerRutaImagen = obtenerRutaImagen

	readonly etiquetas: Record<EstadoVacuna, string> = {
		completa: "Completa",
		vencida: "Dosis vencida",
		pendiente: "En curso",
		"sin-dosis": "Sin dosis",
	}

	constructor(
		private aRoute: ActivatedRoute,
		private _router: Router,
		private _mascotaService: MascotaService,
		private _vacunaService: VacunaService,
		private _dosisService: DosisService,
		private _sbService: SnackbarService,
		private _confirmacion: ConfirmacionService
	) {
		this.idMascota = Number(this.aRoute.snapshot.paramMap.get("idMascota"))
	}

	ngOnInit(): void {
		this.loading = true
		forkJoin({
			mascota: this._mascotaService.getMascota(this.idMascota),
			vacunas: this._vacunaService.getVacunas(this.idMascota),
		}).subscribe({
			next: ({ mascota, vacunas }) => {
				this.mascota = mascota
				this.armarFicha(vacunas)
				this.loading = false
			},
			error: () => (this.loading = false),
		})
	}

	obtenerVacunas() {
		this.loading = true
		this._vacunaService.getVacunas(this.idMascota).subscribe({
			next: (vacunas) => {
				this.armarFicha(vacunas)
				this.loading = false
			},
			error: () => (this.loading = false),
		})
	}

	// Ordena las dosis, calcula el estado de cada vacuna y arma el historial cronológico.
	private armarFicha(vacunas: Vacuna[]) {
		const hoy = new Date()
		hoy.setHours(0, 0, 0, 0)

		this.vacunas = vacunas
			.map((vacuna) => {
				const dosis = [...(vacuna.dosificaciones ?? [])].sort(
					(a, b) => +new Date(a.fechaAplicacion) - +new Date(b.fechaAplicacion)
				)
				const ultima = dosis[dosis.length - 1]
				const completa = dosis.length >= vacuna.cantidadDosis
				const proxima = !completa && ultima ? new Date(ultima.fechaProximaAplicacion) : null
				let estado: EstadoVacuna = "sin-dosis"
				if (completa) estado = "completa"
				else if (proxima) estado = proxima < hoy ? "vencida" : "pendiente"
				return { ...vacuna, dosis, aplicadas: dosis.length, proxima, estado }
			})
			.sort((a, b) => a.nombre.localeCompare(b.nombre))

		this.historial = this.vacunas
			.flatMap((vacuna) => vacuna.dosis.map((dosis, i) => ({ vacuna, dosis, numero: i + 1 })))
			.sort((a, b) => +new Date(b.dosis.fechaAplicacion) - +new Date(a.dosis.fechaAplicacion))

		this.proximas = this.vacunas
			.filter((vacuna) => vacuna.proxima)
			.sort((a, b) => +a.proxima! - +b.proxima!)
	}

	porcentaje(vacuna: VacunaFicha): number {
		return Math.min(100, (vacuna.aplicadas / vacuna.cantidadDosis) * 100)
	}

	eliminarMascota() {
		if (!this.mascota) return
		this._confirmacion
			.confirmar({
				titulo: `¿Borrar a ${this.mascota.nombre}?`,
				mensaje: "Se borran también sus vacunas y dosis registradas. No se puede deshacer.",
			})
			.subscribe((confirmado) => {
				if (!confirmado) return
				this.loading = true
				this._mascotaService.deleteMascota(this.idMascota).subscribe({
					next: () => {
						this._sbService.mostrarMensajeExitoso("Mascota borrada")
						this._router.navigate(["/mascotas"])
					},
					error: () => (this.loading = false),
				})
			})
	}

	removerVacuna(vacuna: VacunaFicha) {
		this._confirmacion
			.confirmar({
				titulo: `¿Borrar la vacuna ${vacuna.nombre}?`,
				mensaje: vacuna.aplicadas
					? `Se borran también las ${vacuna.aplicadas} dosis registradas.`
					: "Todavía no tiene dosis registradas.",
			})
			.subscribe((confirmado) => {
				if (!confirmado || !vacuna.id) return
				this.loading = true
				this._vacunaService.removeVacuna(this.idMascota, vacuna.id).subscribe({
					next: () => {
						this._sbService.mostrarMensajeExitoso("Vacuna borrada")
						this.obtenerVacunas()
					},
					error: () => (this.loading = false),
				})
			})
	}

	removerDosis(vacuna: VacunaFicha, dosis: Dosis, numero: number) {
		this._confirmacion
			.confirmar({
				titulo: `¿Borrar la dosis ${numero} de ${vacuna.nombre}?`,
				mensaje: "Usalo para corregir una carga equivocada.",
			})
			.subscribe((confirmado) => {
				if (!confirmado || !vacuna.id || !dosis.id) return
				this.loading = true
				this._dosisService.removeDosis(this.idMascota, vacuna.id, dosis.id).subscribe({
					next: () => {
						this._sbService.mostrarMensajeExitoso("Dosis borrada")
						this.obtenerVacunas()
					},
					error: () => (this.loading = false),
				})
			})
	}
}
