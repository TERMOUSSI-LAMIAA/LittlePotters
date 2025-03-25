import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,RouterModule,CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  constructor(private router: Router) { } 
  
  isAuthPage(): boolean {
    return this.router.url.includes('/login') ||
      this.router.url.includes('/register');
  } 
}
