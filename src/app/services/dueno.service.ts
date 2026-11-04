import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { Dueño } from "../interfaces/dueño"

@Injectable({
	providedIn: "root",
})
export class DueñoService {
	public myAppUrl: string = environment["endpoint"]
	public myAPIUrl: string = "api/dueños/"

	constructor(private http: HttpClient) {}

	getDueños(busqueda?: string): Observable<Dueño[]> {
		const params = busqueda ? new HttpParams().set("busqueda", busqueda) : undefined
		return this.http.get<Dueño[]>(`${this.myAppUrl}${this.myAPIUrl}`, { params })
	}

	getDueño(id: number): Observable<Dueño> {
		return this.http.get<Dueño>(`${this.myAppUrl}${this.myAPIUrl}${id}`)
	}

	addDueño(dueño: Dueño): Observable<Dueño> {
		return this.http.post<Dueño>(`${this.myAppUrl}${this.myAPIUrl}`, dueño)
	}

	editDueño(id: number, dueño: Dueño): Observable<Dueño> {
		return this.http.put<Dueño>(`${this.myAppUrl}${this.myAPIUrl}${id}`, dueño)
	}

	deleteDueño(id: number): Observable<void> {
		return this.http.delete<void>(`${this.myAppUrl}${this.myAPIUrl}${id}`)
	}
}
