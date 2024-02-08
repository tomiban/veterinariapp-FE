import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment"
import { Dosis } from "../interfaces/dosis"
import { Observable } from "rxjs"

@Injectable({
	providedIn: "root",
})
export class DosisService {
	public myAppUrl: string = environment["endpoint"]
	public myAPIUrl: string = "api/mascotas/"

	constructor(private http: HttpClient) {}

	addDosis(idMascota: number, idVacuna: number, dosis: Dosis): Observable<Dosis> {
		return this.http.post<Dosis>(
			`${this.myAppUrl}${this.myAPIUrl}${idMascota}/vacunas/${idVacuna}/dosis`,
			dosis
		)
	}

	removeDosis(
		idMascota: number,
		idVacuna: number,
		id: number,
	): Observable<void> {
		return this.http.delete<void>(
			`${this.myAppUrl}${this.myAPIUrl}${idMascota}/vacunas/${idVacuna}/dosis/${id}`
		)
	}
}
