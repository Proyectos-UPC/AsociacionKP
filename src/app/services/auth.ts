import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  expiresIn: number;
  usuario: { id: string; usuario: string; rol: string };
}

const TOKEN_KEY = 'kp_token';
const EXPIRES_KEY = 'kp_token_expires';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(usuario: string, contrasena: string): Observable<void> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { usuario, contrasena }).pipe(
      tap(res => {
        sessionStorage.setItem(TOKEN_KEY, res.token);
        sessionStorage.setItem(EXPIRES_KEY, String(Date.now() + res.expiresIn * 1000));
      }),
      map(() => void 0)
    );
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRES_KEY);
  }

  get token(): string | null {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const expiresAt = Number(sessionStorage.getItem(EXPIRES_KEY) ?? 0);
    if (!token || Date.now() > expiresAt) {
      this.logout();
      return null;
    }
    return token;
  }

  get estaAutenticado(): boolean {
    return this.token !== null;
  }
}
