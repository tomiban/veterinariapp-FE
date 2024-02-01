import { Routes } from "@angular/router"
import { ListadoMascotaComponent } from "./components/mascota/listado-mascota/listado-mascota.component"
import { AgregarEditarMascotaComponent } from "./components/mascota/agregar-editar-mascota/agregar-editar-mascota.component"
import { VerMascotaComponent } from "./components/mascota/ver-mascota/ver-mascota.component"
import { AgregarEditarVacunaComponent } from "./components/vacuna/agregar-editar-vacuna/agregar-editar-vacuna.component"

export const routes: Routes = [
	{ path: "", redirectTo: "mascotas", pathMatch: "full" },
	{ path: "mascotas", component: ListadoMascotaComponent },
	{ path: "mascotas/agregar", component: AgregarEditarMascotaComponent },
	{ path: "mascotas/:id", component: VerMascotaComponent },
	{ path: "mascotas/editar/:id", component: AgregarEditarMascotaComponent },
	{
		path: "mascotas/:id/vacunas/agregar",
		component: AgregarEditarVacunaComponent,
	},
	{ path: "**", redirectTo: "mascotas", pathMatch: "full" },
]
