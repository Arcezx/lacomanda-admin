import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PanelLayoutComponent } from './layout/panel-layout/panel-layout.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ProductoFormComponent } from './pages/producto-form/producto-form.component';
import { authGuard } from './guards/auth.guard';
import { MesasComponent } from './pages/mesas/mesas.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: PanelLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'categorias', component: CategoriasComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'productos/nuevo', component: ProductoFormComponent },
      { path: 'productos/:id/editar', component: ProductoFormComponent },
      { path: '', redirectTo: 'categorias', pathMatch: 'full' },
      { path: 'mesas', component: MesasComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'estadisticas', component: EstadisticasComponent },
    ],
  },
];