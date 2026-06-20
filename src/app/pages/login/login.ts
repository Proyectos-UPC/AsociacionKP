import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  usuario = '';
  contrasena = '';
  error = false;
  cargando = false;
  mostrarContrasena = false;

  constructor(private auth: AuthService, private router: Router) {}

  ingresar() {
    this.error = false;
    this.cargando = true;

    setTimeout(() => {
      const ok = this.auth.login(this.usuario, this.contrasena);
      if (ok) {
        this.router.navigate(['/soporte']);
      } else {
        this.error = true;
        this.cargando = false;
      }
    }, 800);
  }
}
