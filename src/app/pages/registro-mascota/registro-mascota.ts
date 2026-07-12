import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { MascotaService } from '../../services/mascota';
import { CatalogosService, CatalogoItem } from '../../services/catalogos';
import { UploadsService } from '../../services/uploads';

@Component({
  selector: 'app-registro-mascota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro-mascota.html',
  styleUrls: ['./registro-mascota.css']
})
export class RegistroMascota implements OnInit {
  form!: FormGroup;
  enviado = false;
  cargando = false;

  imagenPreview: string | null = null;
  archivoSeleccionado: File | null = null;
  razas: CatalogoItem[] = [];
  distritos: CatalogoItem[] = [];

  constructor(
    private fb: FormBuilder,
    private svc: MascotaService,
    private catalogos: CatalogosService,
    private uploads: UploadsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      razaCodigo: ['', Validators.required],
      anio: ['', [Validators.required, Validators.min(0), Validators.max(25)]],
      fechaPerdida: ['', Validators.required],
      distritoCodigo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      contacto: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
    });

    this.catalogos.obtener().subscribe(res => {
      this.razas = res.razas;
      this.distritos = res.distritos;
      this.cdr.markForCheck();
    });
  }

  get f() { return this.form.controls; }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;

    const subida$: Observable<string | null> = this.archivoSeleccionado
      ? this.uploads.subirFoto(this.archivoSeleccionado)
      : of(null);

    subida$.pipe(
      switchMap(imagenUrl => this.svc.registrarMascota({
        ...this.form.value,
        imagen: imagenUrl
      }))
    ).subscribe({
      next: () => {
        this.enviado = true;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Hubo un error al guardar en el servidor:', err);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.archivoSeleccionado = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => { this.imagenPreview = e.target?.result as string; };
      reader.readAsDataURL(input.files[0]);
    }
  }

  quitarFoto() {
    this.imagenPreview = null;
    this.archivoSeleccionado = null;
  }

  nuevo() {
    this.enviado = false;
    this.imagenPreview = null;
    this.archivoSeleccionado = null;
    this.form.reset();
  }
}
