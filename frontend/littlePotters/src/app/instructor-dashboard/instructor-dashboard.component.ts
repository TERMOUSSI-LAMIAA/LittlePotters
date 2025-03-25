import { Component } from '@angular/core';
import { InstructorSidebarComponent } from './instructor-sidebar/instructor-sidebar.component';
import { AuthService } from '../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { InstructorStatsComponent } from './instructor-stats/instructor-stats.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [InstructorSidebarComponent, RouterModule, InstructorStatsComponent,CommonModule],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.scss'
})
export class InstructorDashboardComponent {

  instructorName = "Instructor" //??
  showDropdown = false

  constructor(private authService: AuthService, private router: Router) { }

  isBaseRoute(): boolean {
    return this.router.url === '/instructor-dashboard';
  }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue
    if (currentUser && currentUser.user.fullname) {
      this.instructorName = currentUser.user.fullname
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown
  }
}
