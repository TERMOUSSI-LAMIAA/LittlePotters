import { Component } from '@angular/core';
import { InstructorSidebarComponent } from './instructor-sidebar/instructor-sidebar.component';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [InstructorSidebarComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.scss'
})
export class InstructorDashboardComponent {

}
