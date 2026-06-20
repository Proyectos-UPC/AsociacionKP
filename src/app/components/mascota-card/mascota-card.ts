import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Mascota } from '../../services/mascota';

@Component({
  selector: 'app-mascota-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mascota-card.html',
  styleUrls: ['./mascota-card.css']
})
export class MascotaCard {
  @Input() mascota!: Mascota;

  get estadoLabel() {
    const map: Record<string, string> = {
      buscado: 'En búsqueda',
      encontrado: 'Hallazgo pendiente',
      aprobado: 'Reunido ✓'
    };
    return map[this.mascota.estado] ?? this.mascota.estado;
  }
}