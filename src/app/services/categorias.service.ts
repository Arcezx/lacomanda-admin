import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

const API_URL = 'https://lacomanda-backend.onrender.com/api';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${API_URL}/categorias`);
  }

  crear(categoria: Omit<Categoria, 'id'>): Observable<Categoria> {
    return this.http.post<Categoria>(`${API_URL}/categorias`, categoria);
  }

  actualizar(id: number, categoria: Omit<Categoria, 'id'>): Observable<Categoria> {
    return this.http.put<Categoria>(`${API_URL}/categorias/${id}`, categoria);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/categorias/${id}`);
  }
}