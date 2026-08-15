import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alergeno } from '../models/alergeno.model';

const API_URL = 'http://localhost:8090/api';

@Injectable({
  providedIn: 'root',
})
export class AlergenosService {
  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Alergeno[]> {
    return this.http.get<Alergeno[]>(`${API_URL}/alergenos`);
  }
}