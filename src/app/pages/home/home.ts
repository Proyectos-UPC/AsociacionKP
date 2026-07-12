import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MascotaService, Mascota } from '../../services/mascota';
import { MascotaCard } from '../../components/mascota-card/mascota-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, MascotaCard],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  recientes: Mascota[] = [];
  stats = { buscados: 0, encontrados: 0, aprobados: 0 };

  alianzas = [
    {
      nombre: 'Ministerio de Educación del Perú (MINEDU)',
      descripcion: '"Acreditados como organización de voluntariado, promoviendo la participación estudiantil y el desarrollo de proyectos de impacto social y educativo a nivel nacional."',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Logo_del_Ministerio_de_Educaci%C3%B3n_del_Per%C3%BA_-_MINEDU.png'
    },
    {
      nombre: 'Ministerio de la Mujer y Poblaciones Vulnerables (MIMP)',
      descripcion: '"Reconocidos como organización colaboradora en programas de asistencia social, fortaleciendo redes de apoyo y voluntariado comunitario."',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/PCM-MIMP.png'
    },
    {
      nombre: 'Sistema Nacional de Voluntariado',
      descripcion: '"Institución inscrita formalmente en el registro nacional, promoviendo, coordinando y fortaleciendo acciones de voluntariado en el país."',
      logo: 'https://proa.pe/images/navbar/logo.svg'
    },
    {
      nombre: 'SENAJU – Secretaría Nacional de la Juventud',
      descripcion: '"Entidad aliada dedicada a impulsar la participación juvenil, el liderazgo y el desarrollo de iniciativas de impacto social."',
      logo: 'https://juventud.gob.pe/wp-content/uploads/2022/02/Logo-Web-SENAJU.png'
    },
    {
      nombre: 'Universidad Peruana de Ciencias Aplicadas (UPC)',
      descripcion: '"Convenio de cooperación académica orientado al desarrollo de proyectos sociales, investigación y promoción del voluntariado estudiantil."',
      logo: 'https://marketingperu.beglobal.biz/wp-content/uploads/2025/01/logo-upc-png-transparente.png'
    },
    {
      nombre: 'Universidad Marcelino Champagnat',
      descripcion: '"Alianza estratégica para fortalecer la formación integral, la responsabilidad social y las actividades de servicio comunitario."',
      logo: 'https://univerperu.com/wp-content/uploads/2023/07/Universidad-Marcelino-Champagnat-UMCH.png'
    },
    {
      nombre: 'Universidad San Ignacio de Loyola (USIL)',
      descripcion: '"Convenio de colaboración para promover el liderazgo, la innovación social y la participación activa de la comunidad universitaria."',
      logo: 'https://info.cype.com/wp-content/uploads/2025/06/USIL-Peru-1024x373.png'
    },
    {
      nombre: 'Universidad Privada del Norte (UPN)',
      descripcion: '"Acuerdo de cooperación institucional enfocado en el desarrollo de proyectos de impacto social y experiencias de voluntariado."',
      logo: 'https://d5tnfl9agh5vb.cloudfront.net/uploads/2013/08/upnorte_nuevo_logo.jpg'
    }
  ];
  
testimonios = [
    { 
      autor: 'Familia Mendoza', 
      mascota: 'Toby', 
      foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRIkc70Tw9q5VuaOshMWqD0oDBKJuzC7Ts2OxWDS8I_g&s=1024x1024', 
      texto: '"Gracias al sistema, una vecina vio nuestra alerta y pudimos recuperar a Toby en menos de 24 horas. Estamos infinitamente agradecidos."' 
    },
    { 
      autor: 'Carlos G.', 
      mascota: 'Luna', 
      foto: 'https://img.magnific.com/foto-gratis/hombre-guapo-sentado-bulldog-frances-hierba-parque_176420-3874.jpg?semt=ais_hybrid&w=740&q=80', 
      texto: '"Encontré a Luna desorientada en el parque. Reporté el hallazgo aquí y sus dueños me contactaron el mismo día. Excelente plataforma."' 
    },
    { 
      autor: 'Valeria R.', 
      mascota: 'Max', 
      foto: 'https://static.vecteezy.com/system/resources/previews/011/562/762/large_2x/of-pleased-brunette-female-carries-her-favourite-dog-drinks-hot-coffee-from-paper-cup-has-pleasant-warm-smile-on-face-rejoices-nice-time-spent-with-pet-poses-against-white-fence-background-photo.JPG', 
      texto: '"Habíamos perdido la esperanza, pero gracias a que alguien reportó haberlo visto cerca de la avenida, pudimos llegar a tiempo para encontrarlo."' 
    },
    { 
      autor: 'Familia Quispe', 
      mascota: 'Rocky', 
      foto: 'https://wsrv.nl/?url=http%3A%2F%2Fstatic.boredpanda.com%2Fblog%2Fwp-content%2Fuploads%2F2020%2F12%2F5fc9e80518b0f_3cc8BPk__700.jpg&w=750&q=75&output=webp&fit=cover', 
      texto: '"La rapidez con la que se difundió la foto de Rocky fue clave. Gracias a la comunidad por ayudarnos a tenerlo de vuelta en casa."' 
    }
  ];

  indiceTestimonios = 0;
  intervaloTestimonios: any;

  @ViewChild('carousel') carousel!: ElementRef;

  constructor(private svc: MascotaService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.svc.listarMascotas({ sort: '-fechaRegistro', pageSize: 3 }).subscribe(res => {
      this.recientes = res.data;
      this.cdr.markForCheck();
    });

    this.svc.getStats().subscribe(stats => {
      this.stats.buscados    = stats.buscado;
      this.stats.encontrados = stats.encontrado;
      this.stats.aprobados   = stats.aprobado;
      this.cdr.markForCheck();
    });

    this.iniciarCarruselTestimonios();
  }

  ngOnDestroy() {
    if (this.intervaloTestimonios) {
      clearInterval(this.intervaloTestimonios);
    }
  }

  iniciarCarruselTestimonios() {
    this.intervaloTestimonios = setInterval(() => {
      this.indiceTestimonios = (this.indiceTestimonios + 2) % this.testimonios.length;
    }, 10000);
  }

  get testimoniosVisibles() {
    return [
      this.testimonios[this.indiceTestimonios],
      this.testimonios[(this.indiceTestimonios + 1) % this.testimonios.length]
    ];
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -320, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
  }
}