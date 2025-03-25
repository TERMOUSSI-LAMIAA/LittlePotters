import { Component, OnInit } from '@angular/core';
import { Reservation, ReservationStatus } from '../../core/models/reservation.model';
import { Observable, take } from 'rxjs';
import { Workshop } from '../../core/models/workshop.model';
import { ReservationState } from '../../store/reservation.state';
import { Store } from '@ngrx/store';
import { ReservationService } from '../../core/services/reservation.service';
import { WorkshopService } from '../../core/services/workshop.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  selectReservations,
  selectCurrentPage,
  selectPageSize,
  selectTotalElements,
  selectTotalPages,
  selectLoading,
  selectError
} from '../../store/reservations/reservation.selectors';
import * as ReservationActions from '../../store/reservations/reservation.actions';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss'
})
export class MyReservationsComponent implements OnInit {
  public Math = Math;
  apiBaseUrl = "http://localhost:8081"; 
  reservations$: Observable<Reservation[]>
  loading$: Observable<boolean>
  error$: Observable<any>
  totalElements$: Observable<number>
  totalPages$: Observable<number>
  currentPage$: Observable<number>

  workshops: Map<number, Workshop> = new Map()
  filteredReservations: Reservation[] = []
  statusFilter = "all"

  showCancelModal = false
  reservationIdToCancel: number | null = null

  reservationStatuses = ReservationStatus

  showUpdateModal = false
  selectedReservation: Reservation | null = null
  updatePlacesCount = 1

  constructor(
    private store: Store<{ reservations: ReservationState }>,
    private reservationService: ReservationService,
    private workshopService: WorkshopService,
    private authService: AuthService,
    public router: Router,
  ) {
    this.reservations$ = this.store.select(selectReservations);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.totalElements$ = this.store.select(selectTotalElements);
    this.totalPages$ = this.store.select(selectTotalPages);
    this.currentPage$ = this.store.select(selectCurrentPage);
  }

  ngOnInit(): void {
    this.loadReservations()
  }

  loadReservations(): void {
    const customerId = this.authService.currentUserValue?.user.id
    if (!customerId) {
      console.error("No customer ID found")
      return
    }

    // Dispatch action to load reservations
    this.store.dispatch(
      ReservationActions.loadCustomerReservations({
        filter: {
          page: 0,
          size: 10,
        },
      }),
    )

    // Subscribe to reservations and load workshop details
    this.reservations$.subscribe((reservations) => {
      if (reservations && reservations.length > 0) {
        this.loadWorkshopDetails(reservations)
        this.filteredReservations = [...reservations]
        this.applyFilters()
      } else {
        this.filteredReservations = []
      }
    })
  }

  loadWorkshopDetails(reservations: Reservation[]): void {
    const workshopIds = reservations.map((res) => res.workshopId)
    const uniqueWorkshopIds = [...new Set(workshopIds)]

    if (uniqueWorkshopIds.length === 0) {
      return
    }

    const workshopPromises = uniqueWorkshopIds.map((id) => this.workshopService.getWorkshopById(id).toPromise())

    Promise.all(workshopPromises)
      .then((workshops) => {
        this.workshops = new Map()
        workshops.forEach((workshop) => {
          if (workshop) {
            if (workshop.imageUrl) {
              workshop.imageUrl = this.getFullImageUrl(workshop.imageUrl);
              this.loadImage(workshop);
            }
            this.workshops.set(workshop.id, workshop)
          }
        })
      })
      .catch((error) => {
        console.error("Error loading workshop details:", error)
      })
  }

  getFullImageUrl(relativeUrl: string): string {
    if (!relativeUrl || relativeUrl.startsWith("http")) {
      return relativeUrl;
    }

    const baseUrl = this.apiBaseUrl.endsWith("/")
      ? this.apiBaseUrl.slice(0, -1)
      : this.apiBaseUrl;
    const imageUrl = relativeUrl.startsWith("/")
      ? relativeUrl
      : `/${relativeUrl}`;

    return `${baseUrl}${imageUrl}`;
  }

  loadImage(workshop: Workshop): void {
    if (!workshop.imageUrl) return;

    this.workshopService.loadWorkshopImage(workshop.imageUrl).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        // Update the workshop in the map with the new image URL
        this.workshops.set(workshop.id, {
          ...workshop,
          imageUrl: imageUrl
        });
        this.filteredReservations = [...this.filteredReservations];
      },
      error: (error) => {
        console.error('Error loading workshop image:', error);
      }
    });
  }

  getWorkshop(workshopId: number): Workshop | undefined {
    return this.workshops.get(workshopId)
  }

  applyFilters(): void {
    this.reservations$.pipe(take(1)).subscribe((reservations) => {
      if (this.statusFilter === "all") {
        this.filteredReservations = [...reservations]
      } else {
        this.filteredReservations = reservations.filter((reservation) => reservation.status === this.statusFilter)
      }
    })
  }

  clearFilters(): void {
    this.statusFilter = "all"
    this.applyFilters()
  }

  goToPage(page: number): void {
    this.currentPage$.pipe(take(1)).subscribe((currentPage) => {
      if (page !== currentPage) {
        this.store.dispatch(
          ReservationActions.loadCustomerReservations({
            filter: {
              page: page,
              size: 10,
            },
          }),
        )
      }
    })
  }

  nextPage(): void {
    this.currentPage$.pipe(take(1)).subscribe((currentPage) => {
      this.totalPages$.pipe(take(1)).subscribe((totalPages) => {
        if (currentPage < totalPages - 1) {
          this.goToPage(currentPage + 1)
        }
      })
    })
  }

  previousPage(): void {
    this.currentPage$.pipe(take(1)).subscribe((currentPage) => {
      if (currentPage > 0) {
        this.goToPage(currentPage - 1)
      }
    })
  }

  openUpdateModal(reservation: Reservation): void {
    this.selectedReservation = reservation
    this.updatePlacesCount = reservation.placesBooked
    this.showUpdateModal = true
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false
    this.selectedReservation = null
  }

  cancelReservation(reservationId: number): void {
    this.reservationIdToCancel = reservationId
    this.showCancelModal = true
  }

  getMaxAvailablePlaces(): number {
    if (!this.selectedReservation) return 1

    const workshop = this.getWorkshop(this.selectedReservation.workshopId)
    if (!workshop) return 1

    //?? return workshop.maxParticipants
    return workshop.availablePlaces + this.selectedReservation.placesBooked
  }

  confirmUpdateReservation(): void {
    if (!this.selectedReservation) return

    // Only update if the number of places has changed
    if (this.updatePlacesCount === this.selectedReservation.placesBooked) {
      this.closeUpdateModal()
      return
    }

    const workshop = this.getWorkshop(this.selectedReservation.workshopId)
    if (!workshop) return

    // Calculate new total price
    const newTotalPrice = workshop.price * this.updatePlacesCount

    // Create updated reservation object
    const updatedReservation = {
      ...this.selectedReservation,
      placesBooked: this.updatePlacesCount,
      totalPrice: newTotalPrice,
    }

    // Dispatch update action
    this.store.dispatch(
      ReservationActions.updateReservationPlaces({
        id: this.selectedReservation.id,
        newPlaces: this.updatePlacesCount
      })
    );

    this.closeUpdateModal()
  }

  closeCancelModal(): void {
    this.showCancelModal = false
    this.reservationIdToCancel = null
  }

  confirmCancelReservation(): void {
    if (!this.reservationIdToCancel) return;

    this.store.dispatch(
      ReservationActions.deleteReservation({
        id: this.reservationIdToCancel
      })
    );

    this.showCancelModal = false;
    this.reservationIdToCancel = null;
  }

  getStatusBadgeClass(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case ReservationStatus.CONFIRMED:
        return "bg-green-100 text-green-800"
      case ReservationStatus.CANCELLED:
        return "bg-red-100 text-red-800"
      case ReservationStatus.COMPLETED:
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
}
