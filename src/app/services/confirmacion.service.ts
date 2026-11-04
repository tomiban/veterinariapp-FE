import { Injectable } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { Observable, map } from "rxjs"
import {
	ConfirmarDialogComponent,
	ConfirmarDialogData,
} from "../components/shared/confirmar-dialog.component"

@Injectable({
	providedIn: "root",
})
export class ConfirmacionService {
	constructor(private dialog: MatDialog) {}

	confirmar(data: ConfirmarDialogData): Observable<boolean> {
		return this.dialog
			.open(ConfirmarDialogComponent, { data, width: "420px", maxWidth: "92vw" })
			.afterClosed()
			.pipe(map((resultado) => resultado === true))
	}
}
