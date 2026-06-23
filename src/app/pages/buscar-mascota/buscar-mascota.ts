import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MascotaService, Mascota } from '../../services/mascota';
import { MascotaCard } from '../../components/mascota-card/mascota-card';

@Component({
  selector: 'app-buscar-mascota',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, MascotaCard],
  templateUrl: './buscar-mascota.html',
  styleUrls: ['./buscar-mascota.css']
})
export class BuscarMascota implements OnInit {
  todas: Mascota[] = [];
  filtradas: Mascota[] = [];
  busqueda = '';
  filtroEstado = '';
  filtroDistrito = '';
  cargando = true;

  distritos = ['Miraflores','San Isidro','Surco','La Molina','San Borja','Barranco','Chorrillos','Lince','Jesús María','Pueblo Libre','Magdalena','San Miguel'];

  constructor(private svc: MascotaService) {}

  ngOnInit() {
    this.svc.listarMascotas().subscribe(list => {
      this.todas = list.filter(m => m.estado !== 'baja');
      this.filtradas = [...this.todas];
      this.cargando = false;
    });
  }

  filtrar() {
    this.filtradas = this.todas.filter(m => {
      const matchNombre = m.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                          m.raza.toLowerCase().includes(this.busqueda.toLowerCase());
      const matchEstado   = !this.filtroEstado   || m.estado === this.filtroEstado;
      const matchDistrito = !this.filtroDistrito || m.distrito === this.filtroDistrito;
      return matchNombre && matchEstado && matchDistrito;
    });
  }

  limpiar() { 
    this.busqueda = ''; 
    this.filtroEstado = ''; 
    this.filtroDistrito = ''; 
    this.filtrar(); 
  }
}