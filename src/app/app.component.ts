import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { ListadoMascotaComponent } from "./components/mascota/listado-mascota/listado-mascota.component"

@Component({
	selector: "app-root",
	standalone: true,
	imports: [CommonModule, RouterOutlet, ListadoMascotaComponent],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
})
export class AppComponent {
	title = "Mascotas"
}
