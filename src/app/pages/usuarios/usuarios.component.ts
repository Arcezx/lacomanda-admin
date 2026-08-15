import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  cargando = false;
  error = '';

  modalAbierto = false;
  editando: Usuario | null = null;

  formUsername = '';
  formNombre = '';
  formPassword = '';
  formRol: 'ADMIN' | 'CAMARERO' = 'CAMARERO';

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.usuariosService.obtenerTodos().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios';
        this.cargando = false;
        console.error(err);
      },
    });
  }

  abrirNuevo() {
    this.editando = null;
    this.formUsername = '';
    this.formNombre = '';
    this.formPassword = '';
    this.formRol = 'CAMARERO';
    this.modalAbierto = true;
  }

  abrirEditar(usuario: Usuario) {
    this.editando = usuario;
    this.formUsername = usuario.username;
    this.formNombre = usuario.nombre;
    this.formPassword = '';
    this.formRol = usuario.rol;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardar() {
    this.error = '';

    if (!this.formUsername.trim() || !this.formNombre.trim()) {
      this.error = 'Completa usuario y nombre';
      return;
    }

    if (!this.editando && !this.formPassword.trim()) {
      this.error = 'La contraseña es obligatoria al crear un usuario';
      return;
    }

    const datos = {
      username: this.formUsername.trim(),
      nombre: this.formNombre.trim(),
      password: this.formPassword.trim(),
      rol: this.formRol,
    };

    const peticion = this.editando
      ? this.usuariosService.actualizar(this.editando.id, datos)
      : this.usuariosService.crear(datos);

    peticion.subscribe({
      next: () => {
        this.cerrarModal();
        this.cargar();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error al guardar el usuario';
        console.error(err);
      },
    });
  }

  eliminar(usuario: Usuario) {
    if (!confirm(`¿Seguro que quieres eliminar a "${usuario.nombre}"?`)) {
      return;
    }

    this.usuariosService.eliminar(usuario.id).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        this.error = 'Error al eliminar el usuario';
        console.error(err);
      },
    });
  }
}