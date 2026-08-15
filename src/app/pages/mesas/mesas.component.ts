import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesasService } from '../../services/mesas.service';
import { Mesa } from '../../models/mesa.model';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.scss',
})
export class MesasComponent implements OnInit {
  mesas: Mesa[] = [];
  cargando = false;
  error = '';

  modalAbierto = false;
  editando: Mesa | null = null;

  formNumero: number | null = null;
  formCapacidad: number | null = null;

  constructor(private mesasService: MesasService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.mesasService.obtenerTodas().subscribe({
      next: (mesas) => {
        this.mesas = mesas.sort((a, b) => a.numero - b.numero);
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar mesas';
        this.cargando = false;
        console.error(err);
      },
    });
  }

  abrirNuevo() {
    this.editando = null;
    this.formNumero = null;
    this.formCapacidad = null;
    this.modalAbierto = true;
  }

  abrirEditar(mesa: Mesa) {
    this.editando = mesa;
    this.formNumero = mesa.numero;
    this.formCapacidad = mesa.capacidad;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardar() {
    if (!this.formNumero || !this.formCapacidad) {
      this.error = 'Completa número y capacidad';
      return;
    }

    const datos = { numero: this.formNumero, capacidad: this.formCapacidad };

    const peticion = this.editando
      ? this.mesasService.actualizar(this.editando.id, datos)
      : this.mesasService.crear(datos);

    peticion.subscribe({
      next: () => {
        this.cerrarModal();
        this.cargar();
      },
      error: (err) => {
        this.error = 'Error al guardar la mesa';
        console.error(err);
      },
    });
  }

  eliminar(mesa: Mesa) {
    if (!confirm(`¿Seguro que quieres eliminar la mesa ${mesa.numero}?`)) {
      return;
    }

    this.mesasService.eliminar(mesa.id).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        this.error = 'Error al eliminar la mesa';
        console.error(err);
      },
    });
  }
}