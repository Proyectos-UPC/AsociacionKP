import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CatalogoItem {
  codigo: string;
  nombre: string;
}

export interface CatalogosResponse {
  razas: CatalogoItem[];
  distritos: CatalogoItem[];
}

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtener(): Observable<CatalogosResponse> {
    return this.http.get<CatalogosResponse>(`${this.apiUrl}/catalogos`);
  }
}
