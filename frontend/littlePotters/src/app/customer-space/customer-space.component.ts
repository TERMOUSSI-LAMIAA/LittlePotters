import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CustomerSidebarComponent } from './customer-sidebar/customer-sidebar.component';
import { CustomerStatsComponent } from './customer-stats/customer-stats.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-space',
  standalone: true,
  imports: [RouterModule, CustomerSidebarComponent, CustomerStatsComponent,CommonModule],
  templateUrl: './customer-space.component.html',
  styleUrl: './customer-space.component.scss'
})
export class CustomerSpaceComponent implements OnInit {
  showDropdown = false
  customerName: string = '';
  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue
    if (currentUser && currentUser.user && currentUser.user.fullname) {
      this.customerName = currentUser.user.fullname
    }
  }

  isBaseRoute(): boolean {
    return this.router.url === '/customer-space';
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown
  }
}
