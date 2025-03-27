import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;
  submitted = false;
  registrationSuccess = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.router.routerState.root.queryParams
      .subscribe(params => {
        if (params['registered'] === 'true') {
          this.registrationSuccess = true;
        }
      });
  }

  get f() { return this.loginForm.controls; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: (response) => {
          this.loading = false;
          const userRoles = response.roles; 
          if (!userRoles || userRoles.length === 0) {
            this.router.navigate(['/home']);
            return;
          }

          if (userRoles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin-dashboard']);
          } else if (userRoles.includes('ROLE_INSTRUCTOR')) {
            this.router.navigate(['/instructor-dashboard']);
          } else if (userRoles.includes('ROLE_CUSTOMER')) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Invalid email or password.';
        }
      });
  }
}
