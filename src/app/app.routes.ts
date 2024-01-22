import { Routes } from "@angular/router"
import { ListadoMascotaComponent } from "./components/listado-mascota/listado-mascota.component"
import { AgregarEditarMascotaComponent } from "./components/agregar-editar-mascota/agregar-editar-mascota.component"
import { VerMascotaComponent } from "./components/ver-mascota/ver-mascota.component"

export const routes: Routes = [
	{ path: "", redirectTo: "mascotas", pathMatch: "full" },
	{ path: "mascotas", component: ListadoMascotaComponent },
	{ path: "mascotas/agregar", component: AgregarEditarMascotaComponent },
	{ path: "mascotas/:id", component: VerMascotaComponent },
	{ path: "mascotas/editar/:id", component: AgregarEditarMascotaComponent },
	{ path: "**", redirectTo: "mascotas", pathMatch: "full" },
]
