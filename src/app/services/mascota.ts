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
  estado: 'buscado' | 'encontrado' | 'aprobado' | 'baja';
  fechaRegistro?: string;
  imagen: string;
  
}

export interface SolicitudBaja {
  mascotaId: string;
  motivo: string;
  contacto: string;
  fecha: string;
  estado: 'pendiente' | 'procesado';
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
  { id: '1', nombre: 'Toby', raza: 'Labrador', anio: 3, fechaPerdida: '2026-05-10', distrito: 'Miraflores', descripcion: 'Labrador color miel con collar azul y placa de identificación. Es muy amigable y suele acercarse a las personas. Fue visto por última vez cerca del Parque Kennedy.', contacto: '999111222', estado: 'buscado', fechaRegistro: '2026-05-10', imagen: 'https://images.pexels.com/photos/30537223/pexels-photo-30537223.jpeg' },
  { id: '2', nombre: 'Luna', raza: 'Beagle', anio: 2, fechaPerdida: '2026-05-08', distrito: 'San Isidro', descripcion: 'Beagle de tamaño mediano con manchas marrones y blancas. Es tímida y puede asustarse con facilidad. Llevaba un collar rojo cuando desapareció.', contacto: '999333444', estado: 'buscado', fechaRegistro: '2026-05-08', imagen: 'https://images.pexels.com/photos/32519887/pexels-photo-32519887.jpeg' },
  { id: '3', nombre: 'Rocky', raza: 'Mestizo', anio: 5, fechaPerdida: '2026-01-01', distrito: 'Surco', descripcion: 'Perro mestizo de color negro con las cuatro patas blancas y una pequeña mancha blanca en el pecho. Es tranquilo y responde a su nombre.', contacto: '999555666', estado: 'encontrado', fechaRegistro: '2026-05-01', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoiRp_RvNLMIkGpcMMjHH28oGh1jY-Pnlus494z3bEbh-WkFHJxZbEBK0&s=10' },
  { id: '4', nombre: 'Coco', raza: 'Golden Retriever', anio: 1, fechaPerdida: '2026-03-28', distrito: 'La Molina', descripcion: 'Cachorro Golden Retriever de pelaje dorado, muy juguetón y enérgico. Llevaba un collar verde con una placa de identificación.', contacto: '999777888', estado: 'aprobado', fechaRegistro: '2026-04-28', imagen: 'https://images.pexels.com/photos/30560317/pexels-photo-30560317.jpeg' },
];

  private solicitudesBaja: SolicitudBaja[] = [];

  private informes: Informe[] = [
    { mascotaId: '3', descripcion: 'Lo encontré cerca al parque Kennedy', contacto: '987654321', fecha: '2026-05-12', estado: 'pendiente' },
    { mascotaId: '4', descripcion: 'Está en mi casa, lo rescaté',         contacto: '912345678', fecha: '2026-05-05', estado: 'aprobado' },
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

  reportarBaja(s: Omit<SolicitudBaja, 'estado'>): Observable<any> {
    this.solicitudesBaja.push({ ...s, estado: 'pendiente' });
    return of({ success: true });
  }

  listarBajas(): Observable<SolicitudBaja[]> { return of([...this.solicitudesBaja]); }

  procesarBaja(mascotaId: string): Observable<any> {
    const s = this.solicitudesBaja.find(b => b.mascotaId === mascotaId);
    if (s) s.estado = 'procesado';
    const m = this.mascotas.find(x => x.id === mascotaId);
    if (m) m.estado = 'baja';
    return of({ success: true });
  }
}