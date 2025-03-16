import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  user: any = null;
  mobileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      
      if (user) {
        this.user.dashboardLink = this.getDashboardLink(user.roles);
      }
    });
  }

  getDashboardLink(roles: string[]): string {
    if (roles.includes('ROLE_ADMIN')) {
      return 'admin-dashboard';
    } else if (roles.includes('ROLE_INSTRUCTOR')) {
      return 'instructor-dashboard';
    } else if (roles.includes('ROLE_CUSTOMER')) {
      return 'customer-space';
    } else {
      return 'home';
    }
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) { 
      if (this.mobileMenuOpen) {
        mobileMenu.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
      }
    }
  }
}
