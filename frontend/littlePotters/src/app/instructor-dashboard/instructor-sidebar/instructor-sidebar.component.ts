import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-instructor-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './instructor-sidebar.component.html',
  styleUrl: './instructor-sidebar.component.scss'
})
export class InstructorSidebarComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  logout() {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}
