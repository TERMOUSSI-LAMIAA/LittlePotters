import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild("fileInput") fileInput!: ElementRef

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  submitted = false;

  selectedFile: File | null = null
  imagePreview: string | null = null

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

  triggerFileInput(): void {
    this.fileInput.nativeElement.click()
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement

    if (input.files && input.files.length) {
      const file = input.files[0]
      this.selectedFile = file

      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  removeImage(): void {
    this.selectedFile = null
    this.imagePreview = null

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = ""
    }
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
    this.submitted = true;
    this.errorMessage = ''; 

    if (this.registerForm.invalid) {
      return; 
    }

    this.loading = true;
    const formData = new FormData()

    // Add form fields to FormData
    formData.append("fullname", this.f["fullname"].value)
    formData.append("email", this.f["email"].value)
    formData.append("phone", this.f["phone"].value)
    formData.append("password", this.f["password"].value)
    formData.append("active", "true")
    formData.append("roles", "CUSTOMER")

    if (this.selectedFile) {
      formData.append("image", this.selectedFile)
    }


    this.authService.register(formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}
