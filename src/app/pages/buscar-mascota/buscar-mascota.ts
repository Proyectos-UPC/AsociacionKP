import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MascotaService, Mascota } from '../../services/mascota';
import { MascotaCard } from '../../components/mascota-card/mascota-card';

@Component({
  selector: 'app-buscar-mascota',
  standalone: true,
  imports: [FormsModule, CommonModule, MascotaCard],
  templateUrl: './buscar-mascota.html',
  styleUrls: ['./buscar-mascota.css']
})
export class BuscarMascota implements OnInit {
  todas: Mascota[] = [];
  filtradas: Mascota[] = [];
  busqueda = '';
  filtroEstado = '';
  filtroDistrito = '';
  filtroRaza = ''; // 1. Nueva variable
  cargando = true;

  razas = ['Mestizo', 'Labrador Retriever', 'Golden Retriever', 'Pastor Alemán', 'Pastor Belga', 'Border Collie', 'Poodle', 'Caniche', 'Beagle', 'Pug', 'Bulldog Inglés', 'Bulldog Francés', 'Pitbull', 'Rottweiler', 'Doberman', 'Boxer', 'Schnauzer', 'Yorkshire Terrier', 'Chihuahua', 'Shih Tzu', 'Maltés', 'Bichón Frisé', 'Cocker Spaniel', 'Springer Spaniel', 'Dálmata', 'Husky Siberiano', 'Alaskan Malamute', 'Samoyedo', 'Akita Inu', 'Shiba Inu', 'Chow Chow', 'Shar Pei', 'Gran Danés', 'San Bernardo', 'Terranova', 'Weimaraner', 'Pointer', 'Setter Inglés', 'Setter Irlandés', 'Galgo', 'Whippet', 'Basset Hound', 'Bloodhound', 'Jack Russell Terrier', 'Fox Terrier', 'Boston Terrier', 'Bull Terrier', 'American Staffordshire Terrier', 'Staffordshire Bull Terrier', 'Cane Corso', 'Mastín Napolitano', 'Mastín Inglés', 'Mastín Español', 'Dogo Argentino', 'Dogo de Burdeos', 'Fila Brasileño', 'Pekinés', 'Lhasa Apso', 'Papillón', 'Pinscher Miniatura', 'Corgi Pembroke', 'Corgi Cardigan', 'Australian Shepherd', 'Australian Cattle Dog', 'Kelpie Australiano', 'Collie', 'Collie Barbudo', 'Pastor Australiano', 'Pastor de los Pirineos', 'Pastor Blanco Suizo', 'Vizsla', 'Rhodesian Ridgeback', 'Basenji', 'Borzoi', 'Airedale Terrier', 'Scottish Terrier', 'West Highland White Terrier', 'Cairn Terrier', 'Norfolk Terrier', 'Norwich Terrier', 'Silky Terrier', 'Toy Fox Terrier', 'Chinese Crested', 'Xoloitzcuintle', 'Perro Sin Pelo del Perú', 'Podenco', 'Komondor', 'Kuvasz', 'Leonberger', 'Keeshond', 'Newfoundland', 'Otro'];
  distritos = ['Ancón', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos', 'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria', 'Lima', 'Lince', 'Los Olivos', 'Lurigancho-Chosica', 'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacámac', 'Pucusana', 'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 'Rímac', 'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar', 'Santa Rosa', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'];

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
      // 3. Nueva condición de filtrado
      const matchRaza     = !this.filtroRaza     || m.raza === this.filtroRaza; 

      return matchNombre && matchEstado && matchDistrito && matchRaza;
    });
  }

  limpiar() { 
    this.busqueda = ''; 
    this.filtroEstado = ''; 
    this.filtroDistrito = ''; 
    this.filtroRaza = ''; // 4. Limpiar el filtro
    this.filtrar(); 
  }
}