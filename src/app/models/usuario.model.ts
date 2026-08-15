export interface Usuario {
  id: number;
  nombre: string;
  username: string;
  rol: 'ADMIN' | 'CAMARERO';
}