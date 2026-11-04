import { Component, Input } from "@angular/core"
import { MatIconModule } from "@angular/material/icon"

// Mensaje para listas vacías o búsquedas sin resultados; la acción va por ng-content.
@Component({
	selector: "app-estado-vacio",
	standalone: true,
	imports: [MatIconModule],
	template: `
		<div class="estado-vacio">
			<mat-icon>{{ icono }}</mat-icon>
			<h3>{{ titulo }}</h3>
			@if (mensaje) {
			<p>{{ mensaje }}</p>
			}
			<ng-content></ng-content>
		</div>
	`,
	styles: `
		.estado-vacio {
			text-align: center;
			padding: 40px 16px;
			color: #5f6368;
		}
		mat-icon {
			font-size: 48px;
			width: 48px;
			height: 48px;
			color: #b39ddb;
		}
		h3 {
			margin: 8px 0 4px;
			color: #333;
		}
		p {
			margin: 0 0 16px;
		}
	`,
})
export class EstadoVacioComponent {
	@Input() icono = "pets"
	@Input({ required: true }) titulo = ""
	@Input() mensaje = ""
}
