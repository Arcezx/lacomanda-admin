import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriasService } from '../../services/categorias.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  cargando = false;
  error = '';

  modalAbierto = false;
  editando: Categoria | null = null;

  formNombreEs = '';
  formNombreVal = '';
  formNombreEn = '';
  formOrden = 1;
  formFoto = '';

  constructor(private categoriasService: CategoriasService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.categoriasService.obtenerTodas().subscribe({
      next: (categorias) => {
        this.categorias = categorias.sort((a, b) => a.orden - b.orden);
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar categorías';
        this.cargando = false;
        console.error(err);
      },
    });
  }

  abrirNuevo() {
    this.editando = null;
    this.formNombreEs = '';
    this.formNombreVal = '';
    this.formNombreEn = '';
    this.formOrden = this.categorias.length + 1;
    this.formFoto = '';
    this.modalAbierto = true;
  }

  abrirEditar(categoria: Categoria) {
    this.editando = categoria;
    this.formNombreEs = categoria.nombreEs;
    this.formNombreVal = categoria.nombreVal;
    this.formNombreEn = categoria.nombreEn;
    this.formOrden = categoria.orden;
    this.formFoto = categoria.foto;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardar() {
    const datos = {
      nombreEs: this.formNombreEs,
      nombreVal: this.formNombreVal,
      nombreEn: this.formNombreEn,
      orden: this.formOrden,
      foto: this.formFoto,
    };

    const peticion = this.editando
      ? this.categoriasService.actualizar(this.editando.id, datos)
      : this.categoriasService.crear(datos);

    peticion.subscribe({
      next: () => {
        this.cerrarModal();
        this.cargar();
      },
      error: (err) => {
        this.error = 'Error al guardar la categoría';
        console.error(err);
      },
    });
  }

  eliminar(categoria: Categoria) {
    if (!confirm(`¿Seguro que quieres eliminar "${categoria.nombreEs}"?`)) {
      return;
    }

    this.categoriasService.eliminar(categoria.id).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        this.error = 'Error al eliminar la categoría';
        console.error(err);
      },
    });
  }
}