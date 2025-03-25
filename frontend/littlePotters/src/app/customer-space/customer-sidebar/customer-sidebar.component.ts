import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-customer-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './customer-sidebar.component.html',
  styleUrl: './customer-sidebar.component.scss'
})
export class CustomerSidebarComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  logout() {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}
