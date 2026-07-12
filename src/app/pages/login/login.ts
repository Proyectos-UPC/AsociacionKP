import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  usuario = '';
  contrasena = '';
  error = false;
  cargando = false;
  mostrarContrasena = false;

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  ingresar() {
    this.error = false;
    this.cargando = true;

    this.auth.login(this.usuario, this.contrasena).subscribe({
      next: () => this.router.navigate(['/soporte']),
      error: () => {
        this.error = true;
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
