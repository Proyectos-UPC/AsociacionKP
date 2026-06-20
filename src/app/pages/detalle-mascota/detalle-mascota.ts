import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MascotaService, Mascota } from '../../services/mascota';

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
  informeEnviado = false;
  mostrarFormulario = false;
  cargando = true;

  constructor(private route: ActivatedRoute, private svc: MascotaService, private fb: FormBuilder) {
    this.informeForm = this.fb.group({
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      contacto:    ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.svc.getMascota(id).subscribe(m => { this.mascota = m; this.cargando = false; });
  }

  get f() { return this.informeForm.controls; }

  enviarInforme() {
    if (this.informeForm.invalid) { this.informeForm.markAllAsTouched(); return; }
    this.svc.enviarInforme({
      mascotaId: this.mascota!.id!,
      descripcion: this.f['descripcion'].value,
      contacto: this.f['contacto'].value,
      fecha: new Date().toISOString().split('T')[0]
    }).subscribe(() => { this.informeEnviado = true; });
  }

  get estadoLabel() {
    const map: any = {
      buscado: 'En búsqueda',
      encontrado: 'Hallazgo reportado — pendiente de validación',
      aprobado: 'Reunido con su familia ✓'
    };
    return map[this.mascota?.estado || ''] || '';
  }
}
