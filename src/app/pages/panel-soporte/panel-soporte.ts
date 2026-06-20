import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService, Informe, Mascota } from '../../services/mascota';

@Component({
  selector: 'app-panel-soporte',
  standalone: true,
  imports: [CommonModule], // Agregado para permitir el uso de *ngIf y *ngFor en el HTML
  templateUrl: './panel-soporte.html', 
  styleUrls: ['./panel-soporte.css']
})
export class PanelSoporte implements OnInit {
  informes: Informe[] = [];
  mascotas: Mascota[] = [];
  cargando = true;
  accionExitosa: string | null = null;

  constructor(private svc: MascotaService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.svc.listarMascotas().subscribe(m => { this.mascotas = m; });
    this.svc.listarInformes().subscribe(i => { this.informes = i; this.cargando = false; });
  }

  getMascota(id: string) { return this.mascotas.find(m => m.id === id); }

  get pendientes() { return this.informes.filter(i => i.estado === 'pendiente'); }
  get resueltos()  { return this.informes.filter(i => i.estado !== 'pendiente'); }

  aprobar(mascotaId: string) {
    this.svc.aprobarInforme(mascotaId).subscribe(() => {
      this.accionExitosa = 'aprobado';
      this.cargar();
      setTimeout(() => this.accionExitosa = null, 2500);
    });
  }

  rechazar(mascotaId: string) {
    this.svc.rechazarInforme(mascotaId).subscribe(() => {
      this.accionExitosa = 'rechazado';
      this.cargar();
      setTimeout(() => this.accionExitosa = null, 2500);
    });
  }
}