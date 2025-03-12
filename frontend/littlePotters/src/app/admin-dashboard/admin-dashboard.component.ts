import { Component, OnInit } from '@angular/core';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ SidebarComponent,RouterModule,CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  adminName: string = 'Admin User'; 
  isDashboardRoute: boolean = true; 
  totalCustomers: number = 245; 
  totalInstructors: number = 12;  
  activeWorkshops: number = 38; 
  recentActivity: any[] = [   
    { description: 'New customer registered', details: 'Sarah Johnson - 2 hours ago' },
    { description: 'New workshop created', details: 'Advanced Glazing Techniques - 5 hours ago' },
    { description: 'Workshop booking confirmed', details: 'Beginner Wheel Throwing - 1 day ago' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isDashboardRoute = this.router.url === '/admin/dashboard'; 
      });
  }

}
