import { Especie} from "../constants/enums/especies.enum";
import { Sexo } from "../constants/enums/sexo.enum";
import { Dueño } from "./dueño";

export interface Mascota {
  id?: number;
  nombre: string;
  especie: Especie | undefined
  sexo: Sexo;
  edad: number;
  raza: string;
  color: string;
  peso: number;
  dueño?: Dueño
}
