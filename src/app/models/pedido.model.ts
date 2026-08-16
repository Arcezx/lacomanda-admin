export interface LineaPedido {
  id: number;
  productoId: number;
  productoNombreEs: string;
  precioUnitario: number;
  cantidad: number;
  notas: string;
  extras: { id: number; nombre: string; precio: number }[];
  subtotal: number;
}

export interface Pedido {
  id: number;
  tipo: 'LOCAL' | 'DOMICILIO';
  estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENVIADO';
  fecha: string;
  formaPago: 'TARJETA' | 'EFECTIVO';
  mesaNumero?: number;
  domicilio?: { id: number; direccion: string; estado: string };
  lineas: LineaPedido[];
  total: number;
}