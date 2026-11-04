import { Routes } from "@angular/router"

export const routes: Routes = [
	{ path: "", redirectTo: "mascotas", pathMatch: "full" },
	{ path: "mascotas", loadComponent: () => import("./components/mascota/listado-mascota/listado-mascota.component").then((m) => m.ListadoMascotaComponent), title: "Mascotas · VeterinariApp" },
	{ path: "mascotas/agregar", loadComponent: () => import("./components/mascota/agregar-editar-mascota/agregar-editar-mascota.component").then((m) => m.AgregarEditarMascotaComponent), title: "Nueva mascota · VeterinariApp" },
	{ path: "mascotas/editar/:idMascota", loadComponent: () => import("./components/mascota/agregar-editar-mascota/agregar-editar-mascota.component").then((m) => m.AgregarEditarMascotaComponent), title: "Editar mascota · VeterinariApp" },
	{ path: "mascotas/:idMascota", loadComponent: () => import("./components/mascota/ver-mascota/ver-mascota.component").then((m) => m.VerMascotaComponent), title: "Ficha de la mascota · VeterinariApp" },
	{
		path: "mascotas/:idMascota/vacunas/agregar",
		loadComponent: () => import("./components/vacuna/agregar-editar-vacuna/agregar-editar-vacuna.component").then((m) => m.AgregarEditarVacunaComponent),
		title: "Nueva vacuna · VeterinariApp",
	},
	{
		path: "mascotas/:idMascota/vacunas/:idVacuna/editar",
		loadComponent: () => import("./components/vacuna/agregar-editar-vacuna/agregar-editar-vacuna.component").then((m) => m.AgregarEditarVacunaComponent),
		title: "Editar vacuna · VeterinariApp",
	},
	{
		path: "mascotas/:idMascota/vacunas/:idVacuna/dosis",
		loadComponent: () => import("./components/vacuna/agregar-editar-vacuna/agregar-editar-vacuna.component").then((m) => m.AgregarEditarVacunaComponent),
		title: "Registrar dosis · VeterinariApp",
	},
	{ path: "duenos", loadComponent: () => import("./components/dueno/listado-duenos/listado-duenos.component").then((m) => m.ListadoDuenosComponent), title: "Dueños · VeterinariApp" },
	{ path: "duenos/agregar", loadComponent: () => import("./components/dueno/agregar-editar-dueno/agregar-editar-dueno.component").then((m) => m.AgregarEditarDuenoComponent), title: "Nuevo dueño · VeterinariApp" },
	{ path: "duenos/editar/:idDueno", loadComponent: () => import("./components/dueno/agregar-editar-dueno/agregar-editar-dueno.component").then((m) => m.AgregarEditarDuenoComponent), title: "Editar dueño · VeterinariApp" },
	{ path: "duenos/:idDueno", loadComponent: () => import("./components/dueno/ver-dueno/ver-dueno.component").then((m) => m.VerDuenoComponent), title: "Dueño · VeterinariApp" },
	{ path: "**", redirectTo: "mascotas", pathMatch: "full" },
]
