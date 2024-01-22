import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { Mascota } from "../interfaces/mascota"

@Injectable({
	providedIn: "root",
})
export class MascotaService {
	public myAppUrl: string = environment["endpoint"]
	public myAPIUrl: string = "api/mascotas/"

	constructor(private http: HttpClient) {}

	getMascotas(): Observable<Mascota[]> {
		return this.http.get<Array<Mascota>>(`${this.myAppUrl}${this.myAPIUrl}`)
	}

	getMascota(id: number): Observable<Mascota> {
		return this.http.get<Mascota>(`${this.myAppUrl}${this.myAPIUrl}${id}`)
	}

	deleteMascota(id: number): Observable<void> {
		return this.http.delete<void>(`${this.myAppUrl}${this.myAPIUrl}${id}`)
	}
}
