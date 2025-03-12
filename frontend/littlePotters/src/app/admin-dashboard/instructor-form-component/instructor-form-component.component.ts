import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRequest, User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-instructor-form-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './instructor-form-component.component.html',
  styleUrl: './instructor-form-component.component.scss'
})
export class InstructorFormComponentComponent {
  //TODO: handle the password update but not the email 
  instructorForm: FormGroup;
  isEditMode = false;
  loading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  instructorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.instructorForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.instructorId = +params['id'];
        this.loadInstructorData(this.instructorId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]],
      confirmPassword: [''],
      phone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]],
      active: [true]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (form.get('password')?.hasError('required') === false && !password) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  loadInstructorData(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (user: User) => {
        this.instructorForm.get('password')?.clearValidators();
        this.instructorForm.get('password')?.addValidators(Validators.minLength(8));
        this.instructorForm.get('password')?.updateValueAndValidity();

        this.instructorForm.patchValue({
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          active: user.active
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load instructor data. Please try again.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.instructorForm.invalid) {
      Object.keys(this.instructorForm.controls).forEach(key => {
        this.instructorForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;

    const instructorData: UserRequest = {
      email: this.instructorForm.value.email,
      fullname: this.instructorForm.value.fullname,
      phone: this.instructorForm.value.phone,
      active: this.instructorForm.value.active,
      roles: ['instructor'], 
      password: this.instructorForm.value.password || '' 
    };

    if (this.isEditMode && this.instructorId) {
      this.userService.updateUser(this.instructorId, instructorData).subscribe({
        next: () => {
          this.loading = false;
          this.navigateBack();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Failed to update instructor. Please try again.';
        }
      });
    } else {
      this.userService.createUser(instructorData).subscribe({
        next: () => {
          this.loading = false;
          this.navigateBack();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Failed to create instructor. Please try again.';
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.instructorForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string, errorType: string): boolean {
    const field = this.instructorForm.get(fieldName);
    return !!(field && field.errors && field.errors[errorType]);
  }

  hasPasswordMismatch(): boolean {
    const confirmPasswordTouched = !!this.instructorForm.get('confirmPassword')?.touched;
    return this.instructorForm.hasError('passwordMismatch') && confirmPasswordTouched;
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }

  cancel(): void {
    this.navigateBack();
  }

  navigateBack(): void {
    this.router.navigate(['/admin/instructors']);
  }
}
