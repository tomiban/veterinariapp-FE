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

	getVacuna(id: number): Observable<Vacuna[]> {
		return this.http.get<Array<Vacuna>>(
			`${this.myAppUrl}${this.myAPIUrl}${id}/vacunas`
		)
	}

	addVacuna(id: number, vacuna: Vacuna): Observable<Vacuna> {
		return this.http.post<Vacuna>(
			`${this.myAppUrl}${this.myAPIUrl}${id}/vacunas`,
			vacuna
		)
	}

	
}
