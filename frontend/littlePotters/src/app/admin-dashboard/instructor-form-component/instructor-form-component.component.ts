import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRequest, User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-instructor-form-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './instructor-form-component.component.html',
  styleUrl: './instructor-form-component.component.scss'
})
export class InstructorFormComponentComponent {
  @ViewChild("fileInput") fileInput!: ElementRef

  instructorForm: FormGroup
  isEditMode = false
  loading = false
  isSubmitting = false
  errorMessage = ""
  showPassword = false
  showConfirmPassword = false
  instructorId: number | null = null

  // Image handling properties
  selectedFile: File | null = null
  imagePreview: string | null = null
  originalImageUrl: string | null = null
  removeCurrentImage = false
  private apiBaseUrl = "http://localhost:8081"

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.instructorForm = this.createForm()
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true
        this.instructorId = +params["id"]
        this.loadInstructorData(this.instructorId)
      }
    })
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        fullname: ["", [Validators.required]],
        email: [{ value: "", disabled: this.isEditMode }, [Validators.required, Validators.email]],
        password: [null, this.isEditMode ? [Validators.minLength(8)] : [Validators.required, Validators.minLength(8)]],
        confirmPassword: [""],
        phone: ["", [Validators.required, Validators.pattern(/^0[5-6-7]\d{8}$/)]],
        active: [true],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    // If password is empty in edit mode, no validation needed
    if (form.get("password")?.hasError("required") === false && !password) {
      return null
    }

    // Only validate if password has a value
    if (password) {
      return password === confirmPassword ? null : { passwordMismatch: true }
    }

    return null
  }

  loadInstructorData(id: number): void {
    this.loading = true
    this.userService.getUserById(id).subscribe({
      next: (user: User) => {
        // Clear password validators for edit mode
        this.instructorForm.get("password")?.clearValidators()
        this.instructorForm.get("password")?.addValidators(Validators.minLength(8))
        this.instructorForm.get("password")?.updateValueAndValidity()

        this.instructorForm.patchValue({
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          active: user.active,
        })

        // Handle image loading
        if (user.imageUrl) {
          this.originalImageUrl = user.imageUrl
          const fullImageUrl = this.getFullImageUrl(user.imageUrl)
          this.loadImage(fullImageUrl)
        }

        this.loading = false
      },
      error: (error) => {
        this.errorMessage = "Failed to load instructor data. Please try again."
        this.loading = false
      },
    })
  }

  getFullImageUrl(relativeUrl: string): string {
    // Check if the URL is already absolute
    if (!relativeUrl || relativeUrl.startsWith("http")) {
      return relativeUrl
    }

    // Remove leading slash if present in both the base URL and the relative URL
    const baseUrl = this.apiBaseUrl.endsWith("/") ? this.apiBaseUrl.slice(0, -1) : this.apiBaseUrl
    const imageUrl = relativeUrl.startsWith("/") ? relativeUrl : `/${relativeUrl}`

    return `${baseUrl}${imageUrl}`
  }

  loadImage(url: string): void {
    this.userService.loadImage(url).subscribe({
      next: (imageBlob) => {
        // Create a URL for the blob and set it as the image preview
        const imageUrl = URL.createObjectURL(imageBlob)
        this.imagePreview = imageUrl
      },
      error: (error) => {
        console.error("Error loading image", error)
      },
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

      // Reset the remove flag since we're adding a new image
      this.removeCurrentImage = false

      // Create preview
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

    // If we're in edit mode and had an original image, mark it for removal
    if (this.isEditMode && this.originalImageUrl) {
      this.removeCurrentImage = true
    }

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = ""
    }
  }

  onSubmit(): void {
    if (this.instructorForm.invalid) {
      Object.keys(this.instructorForm.controls).forEach((key) => {
        this.instructorForm.get(key)?.markAsTouched()
      })
      return
    }

    this.isSubmitting = true
    this.loading = true

    const formData = new FormData()

    // Add form fields to FormData
    formData.append("fullname", this.instructorForm.value.fullname)
    formData.append("email", this.instructorForm.getRawValue().email)
    formData.append("phone", this.instructorForm.value.phone || "")
    formData.append("active", this.instructorForm.value.active.toString())

    // Add roles
    formData.append("roles", "INSTRUCTOR")

    // Only append password if it's not empty
    if (this.instructorForm.value.password ) {
      formData.append("password", this.instructorForm.value.password)
    }

    if (this.selectedFile) {
      // New image selected
      formData.append("image", this.selectedFile);
    } else if (this.isEditMode && this.originalImageUrl && this.removeCurrentImage) {
      // User explicitly removed the image
      formData.append("imageFileName", "null");
    } else if (this.isEditMode && this.originalImageUrl) {
      // Preserve the existing image
      formData.append("imageFileName", this.originalImageUrl.split("/").pop() || "");
    }


    if (this.isEditMode && this.instructorId) {
      this.userService
        .updateProfile(this.instructorId, formData)
        .pipe(
          finalize(() => {
            this.isSubmitting = false
            this.loading = false
          }),
        )
        .subscribe({
          next: () => {
            this.navigateBack()
          },
          error: (error) => {
            this.errorMessage = error.error?.message || "Failed to update instructor. Please try again."
          },
        })
    } else {
      this.userService
        .createUser(formData)
        .pipe(
          finalize(() => {
            this.isSubmitting = false
            this.loading = false
          }),
        )
        .subscribe({
          next: () => {
            this.navigateBack()
          },
          error: (error) => {
            this.errorMessage = error.error?.message || "Failed to create instructor. Please try again."
          },
        })
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.instructorForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getFieldError(fieldName: string, errorType: string): boolean {
    const field = this.instructorForm.get(fieldName)
    return !!(field && field.errors && field.errors[errorType])
  }

  hasPasswordMismatch(): boolean {
    const confirmPasswordTouched = !!this.instructorForm.get("confirmPassword")?.touched
    return this.instructorForm.hasError("passwordMismatch") && confirmPasswordTouched
  }

  togglePasswordVisibility(field: string): void {
    if (field === "password") {
      this.showPassword = !this.showPassword
    } else if (field === "confirm") {
      this.showConfirmPassword = !this.showConfirmPassword
    }
  }

  clearErrorMessage(): void {
    this.errorMessage = ""
  }

  cancel(): void {
    this.navigateBack()
  }

  navigateBack(): void {
    this.router.navigate(["/admin-dashboard/instructors"])
  }
}
