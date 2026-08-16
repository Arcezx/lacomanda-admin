import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesasService } from '../../services/mesas.service';
import { ConfiguracionService } from '../../services/configuracion.service';
import { Mesa } from '../../models/mesa.model';
import * as QRCode from 'qrcode';

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

  urlBase = '';
  modalUrlAbierto = false;
  formUrlBase = '';

  modalQrAbierto = false;
  qrImagenActual = '';
  mesaQrActual: Mesa | null = null;

  constructor(
    private mesasService: MesasService,
    private configuracionService: ConfiguracionService
  ) {}

  ngOnInit() {
    this.cargar();
    this.cargarUrlBase();
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

  cargarUrlBase() {
    this.configuracionService.obtener('url_carta_cliente').subscribe({
      next: (url) => (this.urlBase = url),
      error: () => (this.urlBase = 'http://localhost:8100'),
    });
  }

  abrirModalUrl() {
    this.formUrlBase = this.urlBase;
    this.modalUrlAbierto = true;
  }

  cerrarModalUrl() {
    this.modalUrlAbierto = false;
  }

  guardarUrlBase() {
    if (!this.formUrlBase.trim()) return;

    this.configuracionService.guardar('url_carta_cliente', this.formUrlBase.trim()).subscribe({
      next: () => {
        this.urlBase = this.formUrlBase.trim();
        this.cerrarModalUrl();
      },
      error: (err) => {
        this.error = 'Error al guardar la URL';
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

  urlCompleta(mesa: Mesa): string {
    return `${this.urlBase}/home?codigo=${mesa.qrCode}`;
  }

  async verQr(mesa: Mesa) {
    this.mesaQrActual = mesa;
    this.qrImagenActual = await QRCode.toDataURL(this.urlCompleta(mesa), {
      width: 300,
      margin: 1,
      color: { dark: '#BF0426', light: '#ffffff' },
    });
    this.modalQrAbierto = true;
  }

  cerrarModalQr() {
    this.modalQrAbierto = false;
  }

  descargarQr() {
    if (!this.qrImagenActual || !this.mesaQrActual) return;

    const enlace = document.createElement('a');
    enlace.href = this.qrImagenActual;
    enlace.download = `qr-mesa-${this.mesaQrActual.numero}.png`;
    enlace.click();
  }
}