import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  // Propiedad requerida por el HTML para saber si el menú está abierto
  menuOpen: boolean = false;

  // Función requerida por el botón (click)="toggleMenu()" en el HTML
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}