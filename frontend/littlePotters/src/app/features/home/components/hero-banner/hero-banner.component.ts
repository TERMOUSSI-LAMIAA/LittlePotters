import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss'
})
export class HeroBannerComponent implements OnInit {
  showRoleAlert = false
  roleAlertMessage = ""

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void { }

  reserve() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"])
    }

    if (!this.authService.hasRole("ROLE_CUSTOMER")) {
      this.showRoleAlert = true
      this.roleAlertMessage = "You need a customer account to book a workshop."

      setTimeout(() => {
        this.showRoleAlert = false
      }, 5000)
      return
    }

    this.router.navigate(["customer-space/workshops"])
  }

  viewTutos() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"])
    }

    if (!this.authService.hasRole("ROLE_CUSTOMER")) {
      this.showRoleAlert = true
      this.roleAlertMessage = "You need a customer account to view tutorials."

      setTimeout(() => {
        this.showRoleAlert = false
      }, 5000)
      return
    }

    this.router.navigate(["customer-space/tutorials"])
  }

  switchToCustomerAccount() {
    this.authService.logout()

    this.router.navigate(["/login"])
  }

  dismissAlert() {
    this.showRoleAlert = false
  }
}
