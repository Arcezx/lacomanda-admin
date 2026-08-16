import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../services/pedidos.service';
import { Pedido } from '../../models/pedido.model';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss',
})
export class HistorialComponent {
  desde = this.fechaHoyInicio();
  hasta = this.fechaHoyFin();

  pedidos: Pedido[] = [];
  cargando = false;
  error = '';
  buscado = false;

  constructor(private pedidosService: PedidosService) {}

  private fechaHoyInicio(): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${this.pad(hoy.getMonth() + 1)}-${this.pad(hoy.getDate())}`;
  }

  private fechaHoyFin(): string {
    return this.fechaHoyInicio();
  }

  private pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  buscar() {
    if (!this.desde || !this.hasta) {
      this.error = 'Selecciona ambas fechas';
      return;
    }

    this.error = '';
    this.cargando = true;
    this.buscado = true;

    const desdeCompleto = `${this.desde}T00:00:00`;
    const hastaCompleto = `${this.hasta}T23:59:59`;

    this.pedidosService.obtenerPorRango(desdeCompleto, hastaCompleto).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al buscar pedidos';
        this.cargando = false;
        console.error(err);
      },
    });
  }

  totalGeneral(): number {
    return this.pedidos.reduce((suma, p) => suma + p.total, 0);
  }

  contarPorEstado(estado: string): number {
    return this.pedidos.filter((p) => p.estado === estado).length;
  }
}