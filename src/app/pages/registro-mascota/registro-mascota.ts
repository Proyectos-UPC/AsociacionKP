import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf y *ngFor
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Necesario para [formGroup]
import { RouterLink } from '@angular/router'; // Necesario para routerLink="/buscar"
import { MascotaService } from '../../services/mascota';

@Component({
  selector: 'app-registro-mascota',
  standalone: true,
  // ¡Esta línea es la clave para que la pantalla no quede en blanco!
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './registro-mascota.html',
  styleUrls: ['./registro-mascota.css']
})
export class RegistroMascota implements OnInit {
  form!: FormGroup;
  enviado = false;
  cargando = false;
  
  imagenPreview: string | null = null;
  razas = ['Mestizo', 'Labrador', 'Pug', 'Pitbull', 'Bulldog', 'Otro'];
  distritos = ['Miraflores','San Isidro','Surco','La Molina','San Borja','Barranco','Chorrillos','Lince','Jesús María','Pueblo Libre','Magdalena','San Miguel'];

  constructor(private fb: FormBuilder, private svc: MascotaService) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      raza: ['', Validators.required],
      anio: ['', [Validators.required, Validators.min(0), Validators.max(25)]],
      fechaPerdida: ['', Validators.required],
      distrito: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      contacto: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
    });
  }

  // Getter para acceder fácilmente a los controles del formulario en el HTML
  get f() { return this.form.controls; }

  enviar() {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      return; 
    }
    
    this.cargando = true;
    
    // Aquí asumo que tu servicio tiene un método registrarMascota
    // Si se llama diferente, ajusta "registrarMascota" por el nombre correcto
    this.svc.registrarMascota(this.form.value).subscribe(() => {
      this.enviado = true;
      this.cargando = false;
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => { this.imagenPreview = e.target?.result as string; };
      reader.readAsDataURL(input.files[0]);
    }
  }

  quitarFoto() { this.imagenPreview = null; }

  nuevo() {
    this.enviado = false;
    this.imagenPreview = null;
    this.form.reset();
  }
}