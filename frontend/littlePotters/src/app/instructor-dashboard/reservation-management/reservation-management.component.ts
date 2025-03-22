import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../core/models/reservation.model';
import { Workshop } from '../../core/models/workshop.model';
import { ReservationService } from '../../core/services/reservation.service';
import { WorkshopService } from '../../core/services/workshop.service';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { PaginatedResponse } from '../../core/models/PaginatedResponse.model';

@Component({
  selector: 'app-reservation-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-management.component.html',
  styleUrl: './reservation-management.component.scss'
})
export class ReservationManagementComponent implements OnInit {
  reservations: Reservation[] = []
  workshops: Workshop[] = []
  users: User[] = []
  loading = false
  currentPage = 0
  pageSize = 10
  totalElements = 0
  totalPages = 0
  selectedWorkshopId: number | null = null
  instructorId: number | null = null

  constructor(
    private reservationService: ReservationService,
    private workshopService: WorkshopService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // Get the current instructor ID from the auth service
    this.instructorId = this.authService.currentUserValue?.user?.id || null

    if (!this.instructorId) {
      console.error("No instructor ID found. User may not be logged in or not an instructor.")
      return
    }

    // Check if we have a workshopId in the query params
    this.route.queryParams.subscribe((params) => {
      if (params["workshopId"]) {
        this.selectedWorkshopId = +params["workshopId"]
      }

      // Load instructor's workshops for the filter dropdown
      this.loadInstructorWorkshops()

      // this.loadReservations()
      // Load users for customer information
      this.loadUsers()
    })
  }

  loadInstructorWorkshops(): void {
    if (!this.instructorId) return

    this.loading = true
    this.workshopService.getWorkshops({ page: 0, size: 10, filterByUser: this.instructorId}).subscribe({
      next: (response: PaginatedResponse<Workshop>) => {
        this.workshops = response.content
        this.loadReservations()
      },
      error: (error) => {
        console.error("Error loading workshops:", error)
        this.loading = false
      },
    })
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: any) => {
        this.users = users.content
      },
      error: (error) => {
        console.error("Error loading users:", error)
      },
    })
  }

  loadReservations(): void {
    this.loading = true

    // Use the getInstructorReservations method with optional workshopId filter
    this.reservationService
      .getInstructorReservations(this.currentPage, this.pageSize, this.selectedWorkshopId || undefined)
      .subscribe({
        next: (response: PaginatedResponse<Reservation>) => {
          this.reservations = response.content
          this.totalElements = response.totalElements
          this.totalPages = response.totalPages
          this.loading = false
        },
        error: (error) => {
          console.error("Error loading reservations:", error)
          this.loading = false
        },
      })
  }

  onWorkshopFilterChange(): void {
    this.currentPage = 0 // Reset to first page when filter changes
    this.loadReservations()
  }

  // Helper methods for displaying workshop and customer information
  getWorkshopTitle(workshopId: number): string {
    const workshop = this.workshops.find((w) => w.id === workshopId)
    return workshop ? workshop.title : "Unknown Workshop"
  }

  getCustomerName(customerId: number): string {

    const user = this.users.find((u) => u.id === customerId)
    return user ? user.fullname : "Unknown Customer"
  }

  getCustomerEmail(customerId: number): string {
    const user = this.users.find((u) => u.id === customerId)
    return user ? user.email : "Unknown Email"
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page
      this.loadReservations()
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1)
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1)
  }

  // Update reservation status
  updateReservationStatus(id: number, status: string): void {
    // this.reservationService.updateReservationStatus(id, status).subscribe({
    //   next: (updatedReservation: Reservation) => {
    //     // Update the reservation in the list
    //     const index = this.reservations.findIndex((r) => r.id === id)
    //     if (index !== -1) {
    //       this.reservations[index].status = updatedReservation.status
    //     }
    //   },
    //   error: (error) => {
    //     console.error("Error updating reservation status:", error)

    //     // Handle authentication errors
    //     if (error.status === 401 || error.status === 403) {
    //       alert("Your session may have expired. Please log in again.")
    //       this.authService.logout()
    //       window.location.href = "/login"
    //     }
    //   },
    // })
  }
}
