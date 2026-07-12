import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService, Informe, SolicitudBaja } from '../../services/mascota';

@Component({
  selector: 'app-panel-soporte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-soporte.html',
  styleUrls: ['./panel-soporte.css']
})
export class PanelSoporte implements OnInit {
  informes: Informe[] = [];
  solicitudesBaja: SolicitudBaja[] = [];
  cargando = true;
  accionExitosa: string | null = null;

  constructor(private svc: MascotaService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.svc.listarInformes().subscribe(i => {
      this.informes = i;
      this.cargando = false;
      this.cdr.markForCheck();
    });
    this.svc.listarBajas().subscribe(b => {
      this.solicitudesBaja = b;
      this.cdr.markForCheck();
    });
  }

  get pendientes()     { return this.informes.filter(i => i.estado === 'pendiente'); }
  get resueltos()      { return this.informes.filter(i => i.estado !== 'pendiente'); }
  get bajasPendientes(){ return this.solicitudesBaja.filter(b => b.estado === 'pendiente'); }
  get bajasResueltas() { return this.solicitudesBaja.filter(b => b.estado === 'procesado'); }

  private mostrarAccion(accion: string) {
    this.accionExitosa = accion;
    this.cargar();
    this.cdr.markForCheck();
    setTimeout(() => {
      this.accionExitosa = null;
      this.cdr.markForCheck();
    }, 2500);
  }

  aprobar(informeId: string) {
    this.svc.aprobarInforme(informeId).subscribe(() => this.mostrarAccion('aprobado'));
  }

  rechazar(informeId: string) {
    this.svc.rechazarInforme(informeId).subscribe(() => this.mostrarAccion('rechazado'));
  }

  procesarBaja(bajaId: string) {
    this.svc.procesarBaja(bajaId).subscribe(() => this.mostrarAccion('baja'));
  }

}
