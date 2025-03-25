import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CustomerSidebarComponent } from './customer-sidebar/customer-sidebar.component';

@Component({
  selector: 'app-customer-space',
  standalone: true,
  imports: [RouterModule, CustomerSidebarComponent],
  templateUrl: './customer-space.component.html',
  styleUrl: './customer-space.component.scss'
})
export class CustomerSpaceComponent implements OnInit {
  showDropdown = false
  customerName: string = '';
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue
    if (currentUser && currentUser.user && currentUser.user.fullname) {
      this.customerName = currentUser.user.fullname
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown
  }
}
