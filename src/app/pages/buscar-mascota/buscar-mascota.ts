import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MascotaService, Mascota } from '../../services/mascota';
import { CatalogosService, CatalogoItem } from '../../services/catalogos';
import { MascotaCard } from '../../components/mascota-card/mascota-card';

const PAGE_SIZE = 50;

@Component({
  selector: 'app-buscar-mascota',
  standalone: true,
  imports: [FormsModule, CommonModule, MascotaCard],
  templateUrl: './buscar-mascota.html',
  styleUrls: ['./buscar-mascota.css']
})
export class BuscarMascota implements OnInit {
  filtradas: Mascota[] = [];
  busqueda = '';
  filtroEstado = '';
  filtroDistritoCodigo = '';
  filtroRazaCodigo = '';
  cargando = true;

  razas: CatalogoItem[] = [];
  distritos: CatalogoItem[] = [];

  constructor(private svc: MascotaService, private catalogos: CatalogosService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.catalogos.obtener().subscribe(res => {
      this.razas = res.razas;
      this.distritos = res.distritos;
      this.cdr.markForCheck();
    });
    this.filtrar();
  }

  filtrar() {
    this.cargando = true;
    this.svc.listarMascotas({
      texto: this.busqueda,
      estado: this.filtroEstado,
      razaCodigo: this.filtroRazaCodigo,
      distritoCodigo: this.filtroDistritoCodigo,
      pageSize: PAGE_SIZE
    }).subscribe(res => {
      this.filtradas = res.data.filter(m => m.estado !== 'baja');
      this.cargando = false;
      this.cdr.markForCheck();
    });
  }

  limpiar() {
    this.busqueda = '';
    this.filtroEstado = '';
    this.filtroDistritoCodigo = '';
    this.filtroRazaCodigo = '';
    this.filtrar();
  }
}
