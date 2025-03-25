import { Component, OnInit } from '@angular/core';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { AdminStatsComponent } from './admin-stats/admin-stats.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SidebarComponent, RouterModule, CommonModule, AdminStatsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  user: any = null;
  isDashboardRoute: boolean = true; 
  totalCustomers: number = 245; 
  totalInstructors: number = 12;  
  activeWorkshops: number = 38; 
  recentActivity: any[] = [   
    { description: 'New customer registered', details: 'Sarah Johnson - 2 hours ago' },
    { description: 'New workshop created', details: 'Advanced Glazing Techniques - 5 hours ago' },
    { description: 'Workshop booking confirmed', details: 'Beginner Wheel Throwing - 1 day ago' }
  ];
  showDropdown: boolean = false;
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  isBaseRoute(): boolean {
    return this.router.url === '/admin-dashboard';
  }
  constructor(private router: Router,private authService: AuthService) { }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isDashboardRoute = this.router.url === '/admin/dashboard'; 
      });
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

}
