import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../services/pedidos.service';
import { Pedido } from '../../models/pedido.model';

interface ProductoVendido {
  nombre: string;
  cantidad: number;
  total: number;
}

interface CategoriaVenta {
  nombre: string;
  total: number;
  color: string;
  porcentaje: number;
  dashOffset: number;
}

interface VentaDia {
  fecha: string;
  etiqueta: string;
  total: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss',
})
export class EstadisticasComponent {
  desde = this.fechaHoy();
  hasta = this.fechaHoy();

  pedidos: Pedido[] = [];
  cargando = false;
  error = '';
  buscado = false;

  productosVendidos: ProductoVendido[] = [];
  ventasLocal = 0;
  ventasDomicilio = 0;
  countLocal = 0;
  countDomicilio = 0;
  ventasTarjeta = 0;
  ventasEfectivo = 0;
  ventasPorDia: VentaDia[] = [];
  categoriasVenta: CategoriaVenta[] = [];

  private coloresCategoria = ['#BF0426', '#F28705', '#8C4820', '#2e7d32', '#1976d2', '#8e24aa', '#00838f', '#c2185b'];

  constructor(private pedidosService: PedidosService) {}

  private fechaHoy(): string {
    const hoy = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${hoy.getFullYear()}-${pad(hoy.getMonth() + 1)}-${pad(hoy.getDate())}`;
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
        this.pedidos = pedidos;
        this.calcularEstadisticas();
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar estadísticas';
        this.cargando = false;
        console.error(err);
      },
    });
  }

  private calcularEstadisticas() {
    const mapaProductos = new Map<string, ProductoVendido>();
    const mapaCategorias = new Map<string, number>();
    const mapaDias = new Map<string, number>();

    this.ventasLocal = 0;
    this.ventasDomicilio = 0;
    this.countLocal = 0;
    this.countDomicilio = 0;
    this.ventasTarjeta = 0;
    this.ventasEfectivo = 0;

    for (const pedido of this.pedidos) {
      if (pedido.tipo === 'LOCAL') {
        this.ventasLocal += pedido.total;
        this.countLocal++;
      } else {
        this.ventasDomicilio += pedido.total;
        this.countDomicilio++;
      }

      if (pedido.formaPago === 'TARJETA') {
        this.ventasTarjeta += pedido.total;
      } else {
        this.ventasEfectivo += pedido.total;
      }

      const diaClave = pedido.fecha.substring(0, 10);
      mapaDias.set(diaClave, (mapaDias.get(diaClave) ?? 0) + pedido.total);

      for (const linea of pedido.lineas) {
        const existente = mapaProductos.get(linea.productoNombreEs);
        if (existente) {
          existente.cantidad += linea.cantidad;
          existente.total += linea.subtotal;
        } else {
          mapaProductos.set(linea.productoNombreEs, {
            nombre: linea.productoNombreEs,
            cantidad: linea.cantidad,
            total: linea.subtotal,
          });
        }

        const cat = linea.categoriaNombreEs ?? 'Sin categoría';
        mapaCategorias.set(cat, (mapaCategorias.get(cat) ?? 0) + linea.subtotal);
      }
    }

    this.productosVendidos = Array.from(mapaProductos.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 8);

    this.ventasPorDia = Array.from(mapaDias.entries())
      .map(([fecha, total]) => ({
        fecha,
        etiqueta: this.formatearEtiquetaDia(fecha),
        total,
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    const totalCategorias = Array.from(mapaCategorias.values()).reduce((s, v) => s + v, 0);
    let acumulado = 0;
    this.categoriasVenta = Array.from(mapaCategorias.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([nombre, total], i) => {
        const porcentaje = totalCategorias > 0 ? (total / totalCategorias) * 100 : 0;
        const dashOffset = 100 - acumulado;
        acumulado += porcentaje;
        return {
          nombre,
          total,
          color: this.coloresCategoria[i % this.coloresCategoria.length],
          porcentaje,
          dashOffset,
        };
      });
  }

  private formatearEtiquetaDia(fechaIso: string): string {
    const [, mes, dia] = fechaIso.split('-');
    return `${dia}/${mes}`;
  }

  totalGeneral(): number {
    return this.pedidos.reduce((suma, p) => suma + p.total, 0);
  }

  ticketMedio(): number {
    if (this.pedidos.length === 0) return 0;
    return this.totalGeneral() / this.pedidos.length;
  }

  maxCantidadProducto(): number {
    return Math.max(...this.productosVendidos.map((p) => p.cantidad), 1);
  }

  maxVentaDia(): number {
    return Math.max(...this.ventasPorDia.map((v) => v.total), 1);
  }

  colorBarra(index: number): string {
    const opacidad = 1 - index * 0.09;
    return `rgba(191, 4, 38, ${Math.max(opacidad, 0.35)})`;
  }

  porcentajeLocal(): number {
    const total = this.ventasLocal + this.ventasDomicilio;
    if (total === 0) return 0;
    return (this.ventasLocal / total) * 100;
  }

  porcentajeDomicilio(): number {
    return 100 - this.porcentajeLocal();
  }

  porcentajeTarjeta(): number {
    const total = this.ventasTarjeta + this.ventasEfectivo;
    if (total === 0) return 0;
    return (this.ventasTarjeta / total) * 100;
  }

  porcentajeEfectivo(): number {
    return 100 - this.porcentajeTarjeta();
  }
}