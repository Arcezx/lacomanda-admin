import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-panel-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './panel-layout.component.html',
  styleUrl: './panel-layout.component.scss',
})
export class PanelLayoutComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}