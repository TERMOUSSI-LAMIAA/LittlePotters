import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { WorkshopService } from '../../core/services/workshop.service';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Workshop, WorkshopLevel, WorkshopRequest, WorkshopSchedule } from '../../core/models/workshop.model';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workshop-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './workshop-form.component.html',
  styleUrl: './workshop-form.component.scss'
})
export class WorkshopFormComponent implements OnInit {
  @ViewChild("fileInput") fileInput!: ElementRef

  workshopForm!: FormGroup
  isEditMode = false
  loading = false
  isSubmitting = false
  errorMessage = ""
  workshopId: number | null = null

  selectedFile: File | null = null
  imagePreview: string | null = null
  originalImageUrl: string | null = null
  removeCurrentImage = false
  private apiBaseUrl = "http://localhost:8081"

  constructor(
    private fb: FormBuilder,
    private workshopService: WorkshopService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.createForm()
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"] && params["id"] !== "new") {
        this.isEditMode = true
        this.workshopId = +params["id"]
        this.loadWorkshopData(this.workshopId)
      }
    })
  }
  
  createForm(): void {
    this.workshopForm = this.fb.group({
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      date: ["", [Validators.required,this.futureOrPresentDateValidator()]],  
      level: [WorkshopLevel.BEGINNER, [Validators.required]], 
      schedule: [WorkshopSchedule.MORNING, [Validators.required]], 
      maxParticipants: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      price: [0, [Validators.required, Validators.min(0)]],
    
    });
  }

  
  loadWorkshopData(id: number): void {
    this.loading = true
    this.workshopService.getWorkshopById(id).subscribe({
      next: (workshop: Workshop) => {
        this.workshopForm.patchValue({
          title: workshop.title,
          description: workshop.description,
          date: this.formatDateForInput(workshop.date),  
          level: workshop.level,  
          schedule: workshop.schedule,
          maxParticipants: workshop.maxParticipants,
          price: workshop.price
        });

        if (workshop.imageUrl) {
          this.originalImageUrl = workshop.imageUrl
          const fullImageUrl = this.getFullImageUrl(workshop.imageUrl)
          this.loadImage(fullImageUrl)
        }

        this.loading = false
      },
      error: (error) => {
        this.errorMessage = "Failed to load workshop data. Please try again."
        this.loading = false
      },
    })
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  getFullImageUrl(relativeUrl: string): string {
    if (!relativeUrl || relativeUrl.startsWith("http")) {
      return relativeUrl
    }
    const baseUrl = this.apiBaseUrl.endsWith("/") ? this.apiBaseUrl.slice(0, -1) : this.apiBaseUrl
    const imageUrl = relativeUrl.startsWith("/") ? relativeUrl : `/${relativeUrl}`

    return `${baseUrl}${imageUrl}`
  }

  loadImage(url: string): void {
    this.workshopService.loadWorkshopImage(url).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob)
        this.imagePreview = imageUrl
      },
      error: (error) => {
        console.error('Error loading workshop image:', error)
      }
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

      this.removeCurrentImage = false

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

    if (this.isEditMode && this.originalImageUrl) {
      this.removeCurrentImage = true
    }

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = ""
    }
  }

  onSubmit(): void {
    if (this.workshopForm.invalid) {
      Object.keys(this.workshopForm.controls).forEach((key) => {
        this.workshopForm.get(key)?.markAsTouched()
      })
      return
    }

    this.isSubmitting = true
    this.loading = true
   
    const workshopData: WorkshopRequest = {
      title: this.workshopForm.value.title,
      description: this.workshopForm.value.description,
      date: this.workshopForm.value.date,  
      level: this.workshopForm.value.level,  
      schedule: this.workshopForm.value.schedule, 
      maxParticipants: this.workshopForm.value.maxParticipants,
      price: this.workshopForm.value.price,

    };

    if (this.selectedFile) {
      workshopData.image = this.selectedFile;
    }
    else if (this.isEditMode && this.originalImageUrl && this.removeCurrentImage) {
      workshopData.imageFileName = null;
    }
    else if (this.isEditMode && this.originalImageUrl) {
      workshopData.imageFileName = this.originalImageUrl.split("/").pop();
    }



    if (this.isEditMode && this.workshopId) {
      this.workshopService
        .updateWorkshop(this.workshopId, workshopData)
        .subscribe({
          next: (updatedWorkshop) => {
            if (updatedWorkshop.imageUrl) {
              this.originalImageUrl = updatedWorkshop.imageUrl
              const fullImageUrl = this.getFullImageUrl(updatedWorkshop.imageUrl)
              this.loadImage(fullImageUrl)
            }
            this.navigateBack();
          },
          error: (error) => {
            this.errorMessage = error.error?.message || "Failed to update workshop. Please try again."
          },
        })
    } else {
      this.workshopService
        .createWorkshop(workshopData)
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
            this.errorMessage = error.error?.message || "Failed to create workshop. Please try again."
          },
        })
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.workshopForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getFieldError(fieldName: string, errorType: string): boolean {
    const field = this.workshopForm.get(fieldName)
    return !!(field && field.errors && field.errors[errorType])
  }

  clearErrorMessage(): void {
    this.errorMessage = ""
  }

  cancel(): void {
    this.navigateBack()
  }

  navigateBack(): void {
    this.router.navigate(["/instructor-dashboard/workshops"])
  }
  
  futureOrPresentDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;

      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare dates only

      return selectedDate < today ? { 'datePast': true } : null;
    };
  }
}
