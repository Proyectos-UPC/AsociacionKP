import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Mascota {
  id?: string;
  nombre: string;
  raza: string;
  anio: number;
  fechaPerdida: string;
  distrito: string;
  descripcion: string;
  contacto: string;
  estado: 'buscado' | 'encontrado' | 'aprobado';
  fechaRegistro?: string;
}

export interface Informe {
  mascotaId: string;
  descripcion: string;
  contacto: string;
  fecha: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

@Injectable({ providedIn: 'root' })
export class MascotaService {

  private mascotas: Mascota[] = [
    { id: '1', nombre: 'Toby',  raza: 'Labrador',         anio: 3, fechaPerdida: '2024-05-10', distrito: 'Miraflores', descripcion: 'Collar azul, muy amigable',       contacto: '999111222', estado: 'buscado',    fechaRegistro: '2024-05-10' },
    { id: '2', nombre: 'Luna',  raza: 'Beagle',            anio: 2, fechaPerdida: '2024-05-08', distrito: 'San Isidro', descripcion: 'Manchas marrones, tímida',        contacto: '999333444', estado: 'buscado',    fechaRegistro: '2024-05-08' },
    { id: '3', nombre: 'Rocky', raza: 'Mestizo',           anio: 5, fechaPerdida: '2024-05-01', distrito: 'Surco',      descripcion: 'Color negro, sin collar',         contacto: '999555666', estado: 'encontrado', fechaRegistro: '2024-05-01' },
    { id: '4', nombre: 'Coco',  raza: 'Golden Retriever',  anio: 1, fechaPerdida: '2024-04-28', distrito: 'La Molina',  descripcion: 'Cachorro dorado, muy activo',     contacto: '999777888', estado: 'aprobado',   fechaRegistro: '2024-04-28' },
  ];

  private informes: Informe[] = [
    { mascotaId: '3', descripcion: 'Lo encontré cerca al parque Kennedy', contacto: '987654321', fecha: '2024-05-12', estado: 'pendiente' },
    { mascotaId: '4', descripcion: 'Está en mi casa, lo rescaté',         contacto: '912345678', fecha: '2024-05-05', estado: 'pendiente' },
  ];

  listarMascotas(): Observable<Mascota[]> { return of([...this.mascotas]); }

  getMascota(id: string): Observable<Mascota | undefined> { return of(this.mascotas.find(m => m.id === id)); }

  registrarMascota(m: Mascota): Observable<any> {
    const nueva: Mascota = { ...m, id: Date.now().toString(), estado: 'buscado', fechaRegistro: new Date().toISOString().split('T')[0] };
    this.mascotas.push(nueva);
    return of({ success: true, id: nueva.id });
  }

  enviarInforme(inf: Omit<Informe, 'estado'>): Observable<any> {
    this.informes.push({ ...inf, estado: 'pendiente' });
    const m = this.mascotas.find(x => x.id === inf.mascotaId);
    if (m) m.estado = 'encontrado';
    return of({ success: true });
  }

  listarInformes(): Observable<Informe[]> { return of([...this.informes]); }

  aprobarInforme(mascotaId: string): Observable<any> {
    const inf = this.informes.find(i => i.mascotaId === mascotaId);
    if (inf) inf.estado = 'aprobado';
    const m = this.mascotas.find(x => x.id === mascotaId);
    if (m) m.estado = 'aprobado';
    return of({ success: true });
  }

  rechazarInforme(mascotaId: string): Observable<any> {
    const inf = this.informes.find(i => i.mascotaId === mascotaId);
    if (inf) inf.estado = 'rechazado';
    const m = this.mascotas.find(x => x.id === mascotaId);
    if (m) m.estado = 'buscado';
    return of({ success: true });
  }
}