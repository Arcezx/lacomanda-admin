import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  cargando = false;
  error = '';

  constructor(private productosService: ProductosService, private router: Router) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.productosService.obtenerTodos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar productos';
        this.cargando = false;
        console.error(err);
      },
    });
  }

  irANuevo() {
    this.router.navigate(['/productos/nuevo']);
  }

  irAEditar(producto: Producto) {
    this.router.navigate(['/productos', producto.id, 'editar']);
  }

  eliminar(producto: Producto) {
    if (!confirm(`¿Seguro que quieres eliminar "${producto.nombreEs}"?`)) {
      return;
    }

    this.productosService.eliminar(producto.id).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        this.error = 'Error al eliminar el producto';
        console.error(err);
      },
    });
  }
}