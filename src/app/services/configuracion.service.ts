import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://lacomanda-backend.onrender.com/api';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  constructor(private http: HttpClient) {}

  obtener(clave: string): Observable<string> {
    return this.http.get(`${API_URL}/configuracion/${clave}`, { responseType: 'text' });
  }

  guardar(clave: string, valor: string): Observable<void> {
    return this.http.put<void>(`${API_URL}/configuracion/${clave}`, valor, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}