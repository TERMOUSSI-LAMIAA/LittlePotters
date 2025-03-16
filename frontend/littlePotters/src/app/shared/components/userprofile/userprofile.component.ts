import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role, User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.scss'
})
export class UserprofileComponent implements OnInit {
  @ViewChild("fileInput") fileInput!: ElementRef

  user: User | null = null
  profileForm!: FormGroup
  isSubmitting = false
  profileImage: string | null = null
  selectedFile: File | null = null

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    // For demo purposes, load mock data
    // In a real app, you would fetch from your API
    this.loadUserData()
  }

  loadUserData(): void {
    // Mock user data - replace with API call in production
    this.user = {
      id: 1,
      email: "user@littlepotters.com",
      fullname: "John Doe",
      phone: "(555) 123-4567",
      active: true,
      roles: [{ id: 3, name: "ROLE_CUSTOMER" }],
    }

    // Set profile image if available
    if (this.user.imageUrl) {
      this.profileImage = this.user.imageUrl
    }

    // Initialize form with user data
    this.initForm()
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      fullname: [this.user?.fullname, Validators.required],
      email: [this.user?.email, [Validators.required, Validators.email]],
      phone: [this.user?.phone],
    })
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click()
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement

    if (input.files && input.files.length) {
      const file = input.files[0]
      this.selectedFile = file

      // Create a local URL to display the image
      const reader = new FileReader()
      reader.onload = () => {
        this.profileImage = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.user) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    this.isSubmitting = true

    // Create updated user object
    const updatedUser:User = {
      ...this.user,
      email: this.profileForm.value.email,
      fullname: this.profileForm.value.fullname,
      phone: this.profileForm.value.phone || "",
    }

    // Simulate API call with timeout
    setTimeout(() => {
      // Update local user data
      this.user = updatedUser

      this.isSubmitting = false

      // Show success message
      alert("Profile updated successfully!")
    }, 1000)

    // In a real app, you would call your API:
    /*
    this.userService.updateUser(this.user.id, updatedUser).subscribe({
      next: (response) => {
        this.user = response;
        this.isSubmitting = false;
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isSubmitting = false;
        alert('Failed to update profile. Please try again.');
      }
    });
    */
  }

  resetForm(): void {
    // Reset form to original values
    this.initForm()

    // Reset profile image to original
    if (this.user?.imageUrl) {
      this.profileImage = this.user.imageUrl
    } else {
      this.profileImage = null
    }

    // Clear selected file
    this.selectedFile = null

    // Reset file input
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = ""
    }
  }
}
