import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MascotaService, Mascota } from '../../services/mascota';

const COORDS: Record<string, [number, number]> = {
  'Miraflores':   [-12.1219, -77.0290],
  'San Isidro':   [-12.0980, -77.0500],
  'Surco':        [-12.1534, -76.9918],
  'La Molina':    [-12.0864, -76.9443],
  'San Borja':    [-12.1059, -77.0026],
  'Barranco':     [-12.1445, -77.0223],
  'Chorrillos':   [-12.1789, -77.0148],
  'Lince':        [-12.0868, -77.0368],
  'Jesús María':  [-12.0832, -77.0508],
  'Pueblo Libre': [-12.0784, -77.0641],
  'Magdalena':    [-12.0903, -77.0671],
  'San Miguel':   [-12.0812, -77.0960],
};

@Component({
  selector: 'app-detalle-mascota',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './detalle-mascota.html',
  styleUrls: ['./detalle-mascota.css']
})
export class DetalleMascota implements OnInit {
  mascota?: Mascota;
  informeForm: FormGroup;
  bajaForm: FormGroup;
  informeEnviado = false;
  bajaEnviada = false;
  mostrarFormulario = false;
  mostrarFormBaja = false;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private svc: MascotaService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.informeForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      contacto:    ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });
    this.bajaForm = this.fb.group({
      motivo:   ['fallecimiento', Validators.required],
      contacto: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.svc.getMascota(id).subscribe(m => { this.mascota = m; this.cargando = false; });
  }

  get f()  { return this.informeForm.controls; }
  get bf() { return this.bajaForm.controls; }

  get mapaUrl(): SafeResourceUrl {
    const [lat, lon] = COORDS[this.mascota?.distrito ?? ''] ?? [-12.0464, -77.0428];
    const d = 0.015;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d},${lat - d},${lon + d},${lat + d}&layer=mapnik&marker=${lat},${lon}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  get mapaExternoUrl(): string {
    const distrito = this.mascota?.distrito ?? 'Lima';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(distrito + ', Lima, Perú')}`;
  }

  enviarInforme() {
    if (this.informeForm.invalid) { this.informeForm.markAllAsTouched(); return; }
    this.svc.enviarInforme({
      mascotaId: this.mascota!.id!,
      descripcion: this.f['descripcion'].value,
      contacto: this.f['contacto'].value,
      fecha: new Date().toISOString().split('T')[0]
    }).subscribe(() => { this.informeEnviado = true; });
  }

  enviarBaja() {
    if (this.bajaForm.invalid) { this.bajaForm.markAllAsTouched(); return; }
    this.svc.reportarBaja({
      mascotaId: this.mascota!.id!,
      motivo: this.bf['motivo'].value,
      contacto: this.bf['contacto'].value,
      fecha: new Date().toISOString().split('T')[0]
    }).subscribe(() => { this.bajaEnviada = true; this.mostrarFormBaja = false; });
  }

  get estadoLabel() {
    const map: Record<string, string> = {
      buscado:    'En búsqueda',
      encontrado: 'Hallazgo reportado — pendiente de validación',
      aprobado:   'Reunido con su familia ✓',
      baja:       'Baja procesada',
    };
    return map[this.mascota?.estado ?? ''] ?? '';
  }
}
