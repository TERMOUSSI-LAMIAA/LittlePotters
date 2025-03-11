import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest } from '../../../../core/models/auth.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
      password: ['', [Validators.required, Validators.minLength(8), ]], 
      confirmPassword: ['', Validators.required],
    }, {
      validator: this.passwordMatchValidator 
    });
  }

  ngOnInit(): void {

  }

  get f() { return this.registerForm.controls; }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null; 
    }

    if (passwordControl.value === confirmPasswordControl.value) {
      return null; 
    } else {
      confirmPasswordControl.setErrors({ mustMatch: true });
      return { mustMatch: true }; 
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    console.log('in on submit')
    this.submitted = true;
    this.errorMessage = ''; 

    if (this.registerForm.invalid) {
      console.log("form invalid")
      return; 
    }

    this.loading = true;

    const userData: RegisterRequest = { 
      fullname: this.f['fullname'].value,
      email: this.f['email'].value,
      phone: this.f['phone'].value,
      password: this.f['password'].value,
      active: true, 
      roles: ["CUSTOMER"], 
    };


    this.authService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/home'], { queryParams: { registered: 'true' } });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}
