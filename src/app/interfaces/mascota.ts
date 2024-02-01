import { EspecieAnimal } from "../constants/enums/especies.enum";

export interface Mascota {
  id?: number;
  nombre: string;
  especie: EspecieAnimal | undefined
  edad: number;
  raza: string;
  color: string;
  peso: number;
}
