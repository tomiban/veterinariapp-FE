# veterinariapp-FE

Cliente web del sistema de gestión veterinaria: mascotas, dueños, vacunas y dosis aplicadas.
Angular 17 + Angular Material, consumiendo la API .NET publicada como contenedor en Vercel.

## Demo

**https://veterinariapp-fe.vercel.app**

API y Swagger: [veterinariapp-api](https://github.com/tomiban/veterinariapp-API) ·
[docs interactivas](https://veterinariapp-api.vercel.app/swagger/index.html)

## Funciones

- **Pacientes**: listado con búsqueda (nombre, raza, color o dueño), filtro por especie,
  orden por columna y paginado. Alta y edición con validaciones alineadas con la API.
- **Ficha de la mascota**: datos, dueño con contacto y vacunas. Cada vacuna muestra su
  progreso (dosis aplicadas sobre el esquema) y su estado: completa, en curso o con la
  dosis vencida. Arriba se destaca la próxima aplicación.
- **Dosis**: registro con fecha de aplicación y de próxima aplicación (validada para que
  sea posterior), borrado para corregir cargas equivocadas.
- **Historial de vacunación**: todas las dosis de la mascota en orden cronológico.
- **Dueños**: listado con búsqueda y cantidad de mascotas, alta y edición, ficha con sus
  mascotas y acceso directo para registrar una nueva ya asignada. Un dueño puede tener
  varias mascotas; al borrarlo, sus mascotas quedan sin dueño.
- Confirmación antes de cada borrado, estados vacíos, avisos de error de la API en un solo
  lugar (interceptor HTTP) y reintento cuando el servidor tarda en despertar.
- Responsive: en el celular las tablas se quedan con las columnas clave y los formularios
  pasan a una columna. Fechas y números en formato argentino.

## Stack

- Angular 17 con standalone components, control flow (`@if`, `@for`) y rutas con carga diferida
- Angular Material
- TypeScript

## Desarrollo local

Requisitos: Node 20+.

```bash
npm ci
npm start   # http://localhost:4200
```

El endpoint de la API se configura en `src/environments/environment.development.ts`
(apunta a la API desplegada). Para trabajar contra la API corriendo en local, en el
puerto 5080:

```bash
npm start -- --configuration local
```

## Build y deploy

```bash
npm run build   # genera dist/fe/browser
```

El sitio se publica desde `dist/fe/browser` en Vercel. Para que las rutas de la SPA
funcionen al entrar por URL directa, ese directorio lleva un `vercel.json` con un rewrite
de `/(.*)` a `/index.html`.

## API

El backend vive en [veterinariapp-API](https://github.com/tomiban/veterinariapp-API):
.NET 8 con Entity Framework Core sobre PostgreSQL (Neon), desplegado como contenedor.

## Licencia

MIT. Ver [LICENSE](LICENSE).
