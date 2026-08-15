import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

const API_URL = 'http://localhost:8090/api';

export interface ProductoRequest {
  categoriaId: number;
  nombreEs: string;
  nombreVal: string;
  nombreEn: string;
  descripcionEs: string;
  descripcionVal: string;
  descripcionEn: string;
  precio: number;
  foto: string;
  disponible: boolean;
  alergenoIds: number[];
  ingredientes: { id?: number; nombre: string }[];
  extras: { id?: number; nombre: string; precio: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${API_URL}/productos`);
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${API_URL}/productos/${id}`);
  }

  crear(producto: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(`${API_URL}/productos`, producto);
  }

  actualizar(id: number, producto: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${API_URL}/productos/${id}`, producto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/productos/${id}`);
  }
}