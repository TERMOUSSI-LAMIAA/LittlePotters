import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role, User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.scss'
})
export class UserprofileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  profileForm!: FormGroup;
  user: User | null = null;
  loading = true;
  isSubmitting = false;
  errorMessage = '';
  profileImage: string | null = null;
  selectedFile: File | null = null;

  showPassword = false;
  showConfirmPassword = false;
  isEditMode = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ["", this.isEditMode ? [] : [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (!password && formGroup.get("password")?.validator === null) {
      return null
    }

    return password === confirmPassword ? null : { passwordMismatch: true }
  }

  loadUserData(): void {
    this.loading = true;
    const currentUser = this.authService.currentUserValue;

    if (currentUser && currentUser.user.id) {
      this.userService.getUserById(currentUser.user.id)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (userData) => {
            this.user = userData;
            this.updateFormValues(userData);
            this.loadProfileImage(userData);
          },
          error: (error) => {
            this.errorMessage = 'Failed to load user data. Please try again later.';
            console.error('Error loading user data:', error);
          }
        });
    } else {
      this.loading = false;
      this.errorMessage = 'No user data available. Please login again.';
    }
  }

  loadProfileImage(userData: User): void {
    if (userData.imageUrl) {
      this.userService.loadImage(userData.imageUrl)
        .subscribe({
          next: (blob) => {
            const objectUrl = URL.createObjectURL(blob);
            this.profileImage = objectUrl;
          },
          error: (error) => {
            console.error('Error loading profile image:', error);
          }
        });
    }
  }


  updateFormValues(userData: User): void {
    this.profileForm.patchValue({
      fullname: userData.fullname || '',
      email: userData.email || '',
      phone: userData.phone || '',
      password: '',
      confirmPassword: ''
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = new FormData();
    const formValue = this.profileForm.value;

    // Add form fields to FormData
    formData.append('fullname', formValue.fullname);
    formData.append('email', formValue.email);
    formData.append('phone', formValue.phone || '');
    formData.append('active', 'true');

    if (this.user && this.user.roles && this.user.roles.length > 0) {
      this.user.roles.forEach(role => {
        formData.append('roles', role.name);
      });
      if (formValue.password && formValue.password.trim() !== '') {
        formData.append('password', formValue.password);
      }

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
     

      // Get user ID from current auth user
      const userId = this.authService.currentUserValue?.user.id;

      if (userId) {
        this.userService.updateProfile(userId, formData)
          .pipe(finalize(() => this.isSubmitting = false))
          .subscribe({
            next: (updatedUser) => {
              this.user = updatedUser;
              // Update localStorage with new user data
              const currentUser = this.authService.currentUserValue;
              if (currentUser) {
                // Instead of trying to update the BehaviorSubject directly
                // Update the values in local storage and then use the login method
                // to update the user data in the auth service
                currentUser.user.fullname = updatedUser.fullname;
                // Update the current user in local storage
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                // Re-login with the updated user information
                // This will update the currentUserSubject through the auth service's methods
                if (formValue.password && formValue.password.trim() !== "") {
                  this.authService.login(updatedUser.email, formValue.password).subscribe({
                    error: (error) => {
                      console.error("Error refreshing user session:", error)
                      // Silent error - user is still logged in with old data
                    },
                  })
                }
              }

              // Reset password fields
              this.profileForm.patchValue({
                password: '',
                confirmPassword: ''
              });

              // Show success message or notification
              alert('Profile updated successfully!');
            },
            error: (error) => {
              this.errorMessage = error.message || 'Failed to update profile. Please try again.';
              console.error('Error updating profile:', error);
            }
          });
      } else {
        this.isSubmitting = false;
        this.errorMessage = 'Unable to update profile. User ID not found.';
      }
    }
  }

  resetForm(): void {
    if (this.user) {
      this.updateFormValues(this.user);
    } else {
      this.profileForm.reset();
    }

    // Reset the file input and selected file
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.selectedFile = null;

    // If we were showing a newly selected image, revert to the original
    if (this.user && this.user.imageUrl) {
      this.loadProfileImage(this.user);
    } else {
      this.profileImage = null;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string, errorType: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.errors && field.errors[errorType]);
  }

  hasPasswordMismatch(): boolean {
    const password = this.profileForm.get('password')?.value;
    const confirmPassword = this.profileForm.get('confirmPassword')?.value;

    // Only check for mismatch if both fields have values
    if (password && confirmPassword) {
      return password !== confirmPassword;
    }

    return false;
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
