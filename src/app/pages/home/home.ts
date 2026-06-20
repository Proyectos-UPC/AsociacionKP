import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { MascotaService, Mascota } from '../../services/mascota';
import { MascotaCard } from '../../components/mascota-card/mascota-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, MascotaCard],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  recientes: Mascota[] = [];
  stats = { buscados: 0, encontrados: 0, aprobados: 0 };

  constructor(private svc: MascotaService) {}

  ngOnInit() {
    this.svc.listarMascotas().subscribe(list => {
      this.recientes = list.slice(0, 3);
      this.stats.buscados    = list.filter(m => m.estado === 'buscado').length;
      this.stats.encontrados = list.filter(m => m.estado === 'encontrado').length;
      this.stats.aprobados   = list.filter(m => m.estado === 'aprobado').length;
    });
  }
}