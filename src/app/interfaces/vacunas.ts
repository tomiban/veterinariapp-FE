import { Dosis } from "./dosis";

export interface Vacuna {
  id?: number;
  nombre: string;
  cantidadDosis: number;
  dosificaciones?: Dosis[];
  completada?: boolean;
}
