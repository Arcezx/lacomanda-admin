import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService, ProductoRequest } from '../../services/productos.service';
import { CategoriasService } from '../../services/categorias.service';
import { AlergenosService } from '../../services/alergenos.service';
import { Categoria } from '../../models/categoria.model';
import { Alergeno } from '../../models/alergeno.model';

interface IngredienteForm {
  id?: number;
  nombre: string;
}

interface ExtraForm {
  id?: number;
  nombre: string;
  precio: number;
}

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.scss',
})
export class ProductoFormComponent implements OnInit {
  esEdicion = false;
  productoId: number | null = null;
  guardando = false;
  error = '';

  categorias: Categoria[] = [];
  alergenos: Alergeno[] = [];
  alergenosSeleccionados = new Set<number>();

  categoriaId: number | null = null;
  nombreEs = '';
  nombreVal = '';
  nombreEn = '';
  descripcionEs = '';
  descripcionVal = '';
  descripcionEn = '';
  precio: number | null = null;
  foto = '';
  disponible = true;

  ingredientes: IngredienteForm[] = [];
  extras: ExtraForm[] = [];

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private alergenosService: AlergenosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoriasService.obtenerTodas().subscribe({
      next: (categorias) => (this.categorias = categorias.sort((a, b) => a.orden - b.orden)),
      error: (err) => console.error('Error al cargar categorías', err),
    });

    this.alergenosService.obtenerTodos().subscribe({
      next: (alergenos) => (this.alergenos = alergenos),
      error: (err) => console.error('Error al cargar alérgenos', err),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      this.productoId = Number(idParam);
      this.cargarProducto(this.productoId);
    }
  }

  cargarProducto(id: number) {
    this.productosService.obtenerPorId(id).subscribe({
      next: (producto) => {
        this.categoriaId = producto.categoriaId;
        this.nombreEs = producto.nombreEs;
        this.nombreVal = producto.nombreVal;
        this.nombreEn = producto.nombreEn;
        this.descripcionEs = producto.descripcionEs;
        this.descripcionVal = producto.descripcionVal;
        this.descripcionEn = producto.descripcionEn;
        this.precio = producto.precio;
        this.foto = producto.foto;
        this.disponible = producto.disponible;
        this.ingredientes = producto.ingredientes.map((i) => ({ id: i.id, nombre: i.nombre }));
        this.extras = producto.extras.map((e) => ({ id: e.id, nombre: e.nombre, precio: e.precio }));
        this.alergenosSeleccionados = new Set(producto.alergenos.map((a) => a.id));
      },
      error: (err) => {
        this.error = 'No se pudo cargar el producto';
        console.error(err);
      },
    });
  }

  alternarAlergeno(id: number) {
    if (this.alergenosSeleccionados.has(id)) {
      this.alergenosSeleccionados.delete(id);
    } else {
      this.alergenosSeleccionados.add(id);
    }
  }

  agregarIngrediente() {
    this.ingredientes.push({ nombre: '' });
  }

  eliminarIngrediente(index: number) {
    this.ingredientes.splice(index, 1);
  }

  agregarExtra() {
    this.extras.push({ nombre: '', precio: 0 });
  }

  eliminarExtra(index: number) {
    this.extras.splice(index, 1);
  }

  guardar() {
    this.error = '';

    if (!this.categoriaId || !this.nombreEs || !this.nombreVal || !this.nombreEn || !this.precio) {
      this.error = 'Completa todos los campos obligatorios (categoría, nombres y precio)';
      return;
    }

    const request: ProductoRequest = {
      categoriaId: this.categoriaId,
      nombreEs: this.nombreEs,
      nombreVal: this.nombreVal,
      nombreEn: this.nombreEn,
      descripcionEs: this.descripcionEs,
      descripcionVal: this.descripcionVal,
      descripcionEn: this.descripcionEn,
      precio: this.precio,
      foto: this.foto,
      disponible: this.disponible,
      alergenoIds: Array.from(this.alergenosSeleccionados),
      ingredientes: this.ingredientes
        .filter((i) => i.nombre.trim() !== '')
        .map((i) => ({ id: i.id, nombre: i.nombre.trim() })),
      extras: this.extras
        .filter((e) => e.nombre.trim() !== '')
        .map((e) => ({ id: e.id, nombre: e.nombre.trim(), precio: e.precio })),
    };

    this.guardando = true;

    const peticion =
      this.esEdicion && this.productoId
        ? this.productosService.actualizar(this.productoId, request)
        : this.productosService.crear(request);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.guardando = false;
        this.error = 'Error al guardar el producto';
        console.error(err);
      },
    });
  }

  cancelar() {
    this.router.navigate(['/productos']);
  }
}