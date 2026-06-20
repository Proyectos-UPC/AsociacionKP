import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { RegistroMascota } from './pages/registro-mascota/registro-mascota';
import { BuscarMascota } from './pages/buscar-mascota/buscar-mascota';
import { DetalleMascota } from './pages/detalle-mascota/detalle-mascota';
import { PanelSoporte } from './pages/panel-soporte/panel-soporte';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'registro', component: RegistroMascota },
  { path: 'buscar', component: BuscarMascota },
  { path: 'mascota/:id', component: DetalleMascota },
  { path: 'soporte', component: PanelSoporte },
  { path: '**', redirectTo: '' }
];