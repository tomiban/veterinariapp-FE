import { ApplicationConfig, LOCALE_ID } from "@angular/core"
import { provideRouter, withComponentInputBinding } from "@angular/router"
import { registerLocaleData } from "@angular/common"
import localeEsAr from "@angular/common/locales/es-AR"
import { MAT_DATE_LOCALE } from "@angular/material/core"
import { MatPaginatorIntl } from "@angular/material/paginator"
import { PaginadorEs } from "./paginador-es"

import { routes } from "./app.routes"
import { provideAnimations } from "@angular/platform-browser/animations"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { errorInterceptor } from "./interceptors/error.interceptor"

registerLocaleData(localeEsAr)

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes, withComponentInputBinding()),
		provideAnimations(),
		provideHttpClient(withInterceptors([errorInterceptor])),
		{ provide: LOCALE_ID, useValue: "es-AR" },
		{ provide: MAT_DATE_LOCALE, useValue: "es-AR" },
		{ provide: MatPaginatorIntl, useClass: PaginadorEs },
	],
}
