import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mesa } from '../models/mesa.model';

const API_URL = 'https://lacomanda-backend.onrender.com/api';

export interface MesaRequest {
  numero: number;
  capacidad: number;
}

@Injectable({
  providedIn: 'root',
})
export class MesasService {
  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${API_URL}/mesas`);
  }

  crear(mesa: MesaRequest): Observable<Mesa> {
    return this.http.post<Mesa>(`${API_URL}/mesas`, mesa);
  }

  actualizar(id: number, mesa: MesaRequest): Observable<Mesa> {
    return this.http.put<Mesa>(`${API_URL}/mesas/${id}`, mesa);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/mesas/${id}`);
  }
}