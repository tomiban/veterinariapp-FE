import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Vacuna } from "../interfaces/vacunas"
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http"

@Injectable({
	providedIn: "root",
})
export class VacunaService {
	public myAppUrl: string = environment["endpoint"]
	public myAPIUrl: string = "api/mascotas/"

	constructor(private http: HttpClient) {}

	getVacunas(idMascota: number): Observable<Vacuna[]> {
		return this.http.get<Array<Vacuna>>(
			`${this.myAppUrl}${this.myAPIUrl}${idMascota}/vacunas`
		)
	}

	getVacuna(idMascota: number, idVacuna: number): Observable<Vacuna> {
		return this.http.get<Vacuna>(
			`${this.myAppUrl}${this.myAPIUrl}${idMascota}/vacunas/${idVacuna}`
		)
	}

	addVacuna(idMascota: number, vacuna: Vacuna): Observable<Vacuna> {
		return this.http.post<Vacuna>(
			`${this.myAppUrl}${this.myAPIUrl}${idMascota}/vacunas`,
			vacuna
		)
	}

	editVacuna(
		idMascota: number,
		idVacuna: number,
		vacuna: Vacuna
	): Observable<Vacuna> {
		return this.http.put<Vacuna>(
			`${this.myAppUrl}${this.myAPIUrl}${idMascota}/vacunas/${idVacuna}`,
			vacuna
		)
	}

	removeVacuna(idMascota: number, idVacuna: number): Observable<void> {
		return this.http.delete<void>(
			`${this.myAppUrl}${this.myAPIUrl}${idMascota}/vacunas/${idVacuna}`
		)
	}
}
