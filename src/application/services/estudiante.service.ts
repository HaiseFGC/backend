import { Injectable, HttpException } from "@nestjs/common";
import { ApiUcnConfig } from "src/infrastructure/config/apiucn.config";

@Injectable()
export class EstudianteService {
  async login(email: string, password: string) {
    const url = `${ApiUcnConfig}/login.php?email=${email}&password=${password}`;
    console.log("URL de login:", url); // Línea de depuración

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      throw new Error(`Error en login: ${response.statusText}`);
    }

    const data = await response.json();

    if ("error" in data) {
      throw new Error(data.error);
    }

    return data; // { rut, carreras: [...] }
  }

  async obtenerAvance(rut: string, codCarrera: string) {
    const url = `${ApiUcnConfig}/avance.php?rut=${rut}&codcarrera=${codCarrera}`;

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      throw new Error(`Error en avance: ${response.statusText}`);
    }

    const data = await response.json();

    if ("error" in data) {
      throw new Error(data.error);
    }

    return data; // array con los ramos y estados
  }
}
