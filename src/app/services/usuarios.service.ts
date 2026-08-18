import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

const API_URL = 'https://lacomanda-backend.onrender.com/api';

export interface UsuarioRequest {
  username: string;
  nombre: string;
  password: string;
  rol: 'ADMIN' | 'CAMARERO';
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API_URL}/usuarios`);
  }

  crear(usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_URL}/usuarios`, usuario);
  }

  actualizar(id: number, usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${API_URL}/usuarios/${id}`, usuario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/usuarios/${id}`);
  }
}