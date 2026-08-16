import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';

const API_URL = 'http://localhost:8090/api';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  constructor(private http: HttpClient) {}

  obtenerPorRango(desde: string, hasta: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${API_URL}/pedidos/rango?desde=${desde}&hasta=${hasta}`);
  }
}