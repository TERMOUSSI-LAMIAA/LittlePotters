import { Component } from '@angular/core';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { AboutLittlePottersComponent } from './components/about-little-potters/about-little-potters.component';
import { OurValuesCommitmentsComponent } from './components/our-values-commitments/our-values-commitments.component';
import { ParticipantTestimonialsComponent } from './components/participant-testimonials/participant-testimonials.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroBannerComponent,
    AboutLittlePottersComponent,
    OurValuesCommitmentsComponent,
    ParticipantTestimonialsComponent,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
