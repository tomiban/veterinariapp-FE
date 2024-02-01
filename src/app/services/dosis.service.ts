import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment";
import { Dosis } from "../interfaces/dosis";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class DosisService {
	public myAppUrl: string = environment["endpoint"]
	public myAPIUrl: string = "api/mascotas/"

  constructor(private http: HttpClient) { }
  
  addDosis(id: number,  idVacuna:number, dosis: Dosis): Observable<Dosis> {
    return this.http.post<Dosis>(`${this.myAppUrl}${this.myAPIUrl}${id}/vacunas/${idVacuna}/dosis`, dosis)
  }
}
