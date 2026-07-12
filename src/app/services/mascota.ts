import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Mascota {
  id?: string;
  nombre: string;
  raza: string;
  anio: number;
  fechaPerdida: string;
  distrito: string;
  descripcion: string;
  contacto: string;
  estado: 'buscado' | 'encontrado' | 'aprobado' | 'baja';
  fechaRegistro?: string;
  imagen: string;
}

export interface MascotaCreate {
  nombre: string;
  razaCodigo: string;
  anio: number;
  fechaPerdida: string;
  distritoCodigo: string;
  descripcion: string;
  contacto: string;
  imagen?: string | null;
}

export interface MascotaResumen {
  nombre: string;
  raza: string;
  distrito: string;
  imagen: string | null;
}

export interface SolicitudBaja {
  id: string;
  mascotaId: string;
  motivo: string;
  contacto: string;
  fecha: string;
  estado: 'pendiente' | 'procesado';
  mascota?: MascotaResumen;
}

export interface Informe {
  id: string;
  mascotaId: string;
  descripcion: string;
  contacto: string;
  fecha: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  mascota?: MascotaResumen;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface MascotaFiltros {
  texto?: string;
  estado?: string;
  razaCodigo?: string;
  distritoCodigo?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface MascotaListResponse {
  data: Mascota[];
  pagination: Pagination;
}

export interface MascotaStats {
  buscado: number;
  encontrado: number;
  aprobado: number;
  baja: number;
  total: number;
}

const LISTADO_ADMIN_PAGE_SIZE = 50;

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarMascotas(filtros: MascotaFiltros = {}): Observable<MascotaListResponse> {
    let params = new HttpParams();
    for (const [clave, valor] of Object.entries(filtros)) {
      if (valor !== undefined && valor !== null && valor !== '') {
        params = params.set(clave, String(valor));
      }
    }
    return this.http.get<MascotaListResponse>(`${this.apiUrl}/mascotas`, { params });
  }

  getMascota(id: string): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiUrl}/mascotas/${id}`);
  }

  getStats(): Observable<MascotaStats> {
    return this.http.get<MascotaStats>(`${this.apiUrl}/mascotas/stats`);
  }

  registrarMascota(m: MascotaCreate): Observable<Mascota> {
    return this.http.post<Mascota>(`${this.apiUrl}/mascotas`, m);
  }

  enviarInforme(mascotaId: string, inf: { descripcion: string; contacto: string }): Observable<Informe> {
    return this.http.post<Informe>(`${this.apiUrl}/mascotas/${mascotaId}/informes`, inf);
  }

  listarInformes(estado?: string): Observable<Informe[]> {
    let params = new HttpParams().set('pageSize', String(LISTADO_ADMIN_PAGE_SIZE));
    if (estado) params = params.set('estado', estado);
    return this.http
      .get<{ data: Informe[]; pagination: Pagination }>(`${this.apiUrl}/informes`, { params })
      .pipe(map(res => res.data));
  }

  aprobarInforme(informeId: string): Observable<Informe> {
    return this.http.patch<Informe>(`${this.apiUrl}/informes/${informeId}`, { estado: 'aprobado' });
  }

  rechazarInforme(informeId: string): Observable<Informe> {
    return this.http.patch<Informe>(`${this.apiUrl}/informes/${informeId}`, { estado: 'rechazado' });
  }

  reportarBaja(mascotaId: string, s: { motivo: string; contacto: string }): Observable<SolicitudBaja> {
    return this.http.post<SolicitudBaja>(`${this.apiUrl}/mascotas/${mascotaId}/solicitudes-baja`, s);
  }

  listarBajas(estado?: string): Observable<SolicitudBaja[]> {
    let params = new HttpParams().set('pageSize', String(LISTADO_ADMIN_PAGE_SIZE));
    if (estado) params = params.set('estado', estado);
    return this.http
      .get<{ data: SolicitudBaja[]; pagination: Pagination }>(`${this.apiUrl}/solicitudes-baja`, { params })
      .pipe(map(res => res.data));
  }

  procesarBaja(bajaId: string): Observable<SolicitudBaja> {
    return this.http.patch<SolicitudBaja>(`${this.apiUrl}/solicitudes-baja/${bajaId}`, { estado: 'procesado' });
  }
}
