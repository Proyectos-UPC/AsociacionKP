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
  razas = ['Mestizo', 'Labrador Retriever', 'Golden Retriever', 'Pastor Alemán', 'Pastor Belga', 'Border Collie', 'Poodle', 'Caniche', 'Beagle', 'Pug', 'Bulldog Inglés', 'Bulldog Francés', 'Pitbull', 'Rottweiler', 'Doberman', 'Boxer', 'Schnauzer', 'Yorkshire Terrier', 'Chihuahua', 'Shih Tzu', 'Maltés', 'Bichón Frisé', 'Cocker Spaniel', 'Springer Spaniel', 'Dálmata', 'Husky Siberiano', 'Alaskan Malamute', 'Samoyedo', 'Akita Inu', 'Shiba Inu', 'Chow Chow', 'Shar Pei', 'Gran Danés', 'San Bernardo', 'Terranova', 'Weimaraner', 'Pointer', 'Setter Inglés', 'Setter Irlandés', 'Galgo', 'Whippet', 'Basset Hound', 'Bloodhound', 'Jack Russell Terrier', 'Fox Terrier', 'Boston Terrier', 'Bull Terrier', 'American Staffordshire Terrier', 'Staffordshire Bull Terrier', 'Cane Corso', 'Mastín Napolitano', 'Mastín Inglés', 'Mastín Español', 'Dogo Argentino', 'Dogo de Burdeos', 'Fila Brasileño', 'Pekinés', 'Lhasa Apso', 'Papillón', 'Pinscher Miniatura', 'Corgi Pembroke', 'Corgi Cardigan', 'Australian Shepherd', 'Australian Cattle Dog', 'Kelpie Australiano', 'Collie', 'Collie Barbudo', 'Pastor Australiano', 'Pastor de los Pirineos', 'Pastor Blanco Suizo', 'Vizsla', 'Rhodesian Ridgeback', 'Basenji', 'Borzoi', 'Airedale Terrier', 'Scottish Terrier', 'West Highland White Terrier', 'Cairn Terrier', 'Norfolk Terrier', 'Norwich Terrier', 'Silky Terrier', 'Toy Fox Terrier', 'Chinese Crested', 'Xoloitzcuintle', 'Perro Sin Pelo del Perú', 'Podenco', 'Komondor', 'Kuvasz', 'Leonberger', 'Keeshond', 'Newfoundland', 'Otro'];
  distritos = ['Ancón', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos', 'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria', 'Lima', 'Lince', 'Los Olivos', 'Lurigancho-Chosica', 'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacámac', 'Pucusana', 'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 'Rímac', 'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar', 'Santa Rosa', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'];

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
  // 1. Verificación de validez
  if (this.form.invalid) { 
    this.form.markAllAsTouched(); 
    console.log("El formulario es inválido. Revisa los campos obligatorios.");
    return; 
  }
  
  this.cargando = true;
  
  // 2. IMPRIMIR LOS DATOS EN CONSOLA
  console.log("Datos que se enviarán al servicio:", {
    ...this.form.value,
    estado: 'buscado',
    imagen: this.imagenPreview
  });
  
  // 3. Llamada al servicio con manejo de éxito y error
  this.svc.registrarMascota({
    ...this.form.value,
    estado: 'buscado',
    imagen: this.imagenPreview
  }).subscribe({
    next: (response) => {
      console.log("Guardado exitosamente en el servidor:", response);
      this.enviado = true;
      this.cargando = false;
    },
    error: (err) => {
      console.error("Hubo un error al guardar en el servidor:", err);
      this.cargando = false;
    }
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