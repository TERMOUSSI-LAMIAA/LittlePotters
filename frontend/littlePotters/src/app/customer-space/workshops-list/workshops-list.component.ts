import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Workshop, WorkshopLevel, WorkshopSchedule } from '../../core/models/workshop.model';
import { WorkshopService } from '../../core/services/workshop.service';
import { ReservationService } from '../../core/services/reservation.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ReservationState } from '../../store/reservation.state';
import { Store } from '@ngrx/store';
import { ReservationStatus } from '../../core/models/reservation.model';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { createReservation } from '../../store/reservations/reservation.actions';

@Component({
  selector: 'app-workshops-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workshops-list.component.html',
  styleUrl: './workshops-list.component.scss'
})
export class WorkshopsListComponent implements OnInit {
  public Math = Math; 
  workshops: Workshop[] = []
  filteredWorkshops: Workshop[] = []
  loading = false
  currentPage = 0
  pageSize = 6
  totalElements = 0
  totalPages = 0
  apiBaseUrl = "http://localhost:8081"
  users: User[] = [];
  loadingUsers = false;
  // Search and filter
  searchTerm = ""
  levelFilter = "all"
  scheduleFilter = "all"

  // Reservation modal
  showReservationModal = false
  showSuccessModal = false
  selectedWorkshopId: number | null = null
  placesToBook = 1

  // Enum references for template
  workshopLevels = WorkshopLevel
  workshopSchedules = WorkshopSchedule

  constructor(
    private workshopService: WorkshopService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private store: Store<{ reservations: ReservationState }>,
  ) { }

  ngOnInit(): void {
    this.loadWorkshops()
    this.loadAllInstructors();
  }

  loadAllInstructors(): void {
    this.loadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.content;
        this.loadingUsers = false;
      },
      error: (error) => {
        console.error("Error loading instructors:", error);
        this.loadingUsers = false;
      }
    });
  }

  getInstructorName(instructorId: number): string {
    const instructor = this.users.find(u => u.id === instructorId);
    return instructor ? instructor.fullname : "Unknown Instructor";
  }

  loadWorkshops(): void {
    this.loading = true
    this.workshopService.getUpcomingWorkshops({
      page: this.currentPage,
      size: this.pageSize
    }).subscribe({
      next: (response) => {
        this.workshops = response.content
        this.filteredWorkshops = [...this.workshops]
        this.totalElements = response.totalElements
        this.totalPages = response.totalPages

        this.workshops.forEach((workshop) => {
          if (workshop.imageUrl) {
            workshop.imageUrl = this.getFullImageUrl(workshop.imageUrl)
            this.loadImage(workshop.imageUrl, workshop);
          }
        })
    
        this.applyFilters()
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading workshops:", error)
        this.loading = false
      },
    })
  }
  loadImage(url: string, workshop: Workshop): void {
    this.workshopService.loadWorkshopImage(url).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        workshop.imageUrl = imageUrl;
        this.filteredWorkshops = [...this.filteredWorkshops];
      },
      error: (error) => {
        console.error('Error loading workshop image:', error);
      }
    });
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

  applyFilters(): void {
    this.filteredWorkshops = this.workshops.filter((workshop) => {
      // Apply level filter
      if (this.levelFilter !== "all" && workshop.level !== this.levelFilter) {
        return false
      }

      // Apply schedule filter
      if (this.scheduleFilter !== "all" && workshop.schedule !== this.scheduleFilter) {
        return false
      }

      // Apply search term filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase()
        return (
          workshop.title.toLowerCase().includes(searchLower) || workshop.description.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }

  clearFilters(): void {
    this.searchTerm = ""
    this.levelFilter = "all"
    this.scheduleFilter = "all"
    this.applyFilters()
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page
      this.loadWorkshops()
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1)
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1)
  }


  reserveWorkshop(id: number): void {
    this.selectedWorkshopId = id
    this.placesToBook = 1
    this.showReservationModal = true
  }

  cancelReservationModal(): void {
    this.showReservationModal = false
    this.selectedWorkshopId = null
  }

  confirmReservation(): void {
    if (!this.selectedWorkshopId) return

    const customerId = this.authService.currentUserValue?.user.id
    if (!customerId) {
      console.error("No customer ID found")
      return
    }

    const reservationRequest = {
      workshopId: this.selectedWorkshopId,
      placesBooked: this.placesToBook,
      status: ReservationStatus.PENDING,
    }

    this.store.dispatch(createReservation({ reservation: reservationRequest }));
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false
    this.selectedWorkshopId = null
  }

  viewMyReservations(): void {
    this.router.navigate(["/customer-space/my-reservations"])
  }

  // Helper methods for template
  getAvailablePlacesText(workshop: Workshop): string {
    return `${workshop.availablePlaces}/${workshop.maxParticipants} Places Available`
  }

  isWorkshopFull(workshop: Workshop): boolean {
    return workshop.availablePlaces <= 0
  }

  getLevelBadgeClass(level: WorkshopLevel): string {
    switch (level) {
      case WorkshopLevel.BEGINNER:
        return "bg-green-100 text-green-800"
      case WorkshopLevel.INTERMEDIATE:
        return "bg-blue-100 text-blue-800"
      case WorkshopLevel.ADVANCED:
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getScheduleBadgeClass(schedule: WorkshopSchedule): string {
    switch (schedule) {
      case WorkshopSchedule.MORNING:
        return "bg-yellow-100 text-yellow-800"
      case WorkshopSchedule.AFTERNOON:
        return "bg-orange-100 text-orange-800"
      case WorkshopSchedule.EVENING:
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
}
