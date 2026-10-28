# veterinariapp-FE

Cliente web del sistema de gestión veterinaria: mascotas, dueños, vacunas y dosis aplicadas.
Angular 17 + Angular Material, consumiendo la API .NET publicada como contenedor en Vercel.

## Demo

**https://veterinariapp-fe.vercel.app**

API y Swagger: [veterinariapp-api](https://github.com/tomiban/veterinariapp-API) ·
[docs interactivas](https://veterinariapp-api.vercel.app/swagger/index.html)

## Stack

- Angular 17 con standalone components
- Angular Material
- TypeScript

## Desarrollo local

Requisitos: Node 20+.

```bash
npm ci
npm start   # http://localhost:4200
```

El endpoint de la API se configura en `src/environments/environment.development.ts`.

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
