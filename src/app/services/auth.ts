import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly USUARIO = 'admin';
  private readonly CONTRASENA = 'UPC2026';
  private _autenticado = false;

  login(usuario: string, contrasena: string): boolean {
    if (usuario === this.USUARIO && contrasena === this.CONTRASENA) {
      this._autenticado = true;
      sessionStorage.setItem('kp_admin', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this._autenticado = false;
    sessionStorage.removeItem('kp_admin');
  }

  get estaAutenticado(): boolean {
    return this._autenticado || sessionStorage.getItem('kp_admin') === 'true';
  }
}
