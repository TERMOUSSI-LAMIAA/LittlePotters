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
import { ReservationsFilter, ReservationState } from '../../store/reservation.state';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as ReservationSelectors from '../../store/reservations/reservation.selectors';
import * as ReservationActions from '../../store/reservations/reservation.actions';

@Component({
  selector: 'app-reservation-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-management.component.html',
  styleUrl: './reservation-management.component.scss'
})
export class ReservationManagementComponent implements OnInit {
  reservations$: Observable<Reservation[]>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;
  totalElements$: Observable<number>;
  totalPages$: Observable<number>;
  loading$: Observable<boolean>;

  workshops: Workshop[] = [];
  users: User[] = [];
  selectedWorkshopId: number | null = null;
  instructorId: number | null = null;

  constructor(
    private store: Store<{ reservations: ReservationState }>,
    private reservationService: ReservationService,
    private workshopService: WorkshopService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
 
    this.reservations$ = this.store.select(state => state.reservations.reservations);
    this.currentPage$ = this.store.select(state => state.reservations.currentPage);
    this.pageSize$ = this.store.select(state => state.reservations.pageSize);
    this.totalElements$ = this.store.select(state => state.reservations.totalElements);
    this.totalPages$ = this.store.select(state => state.reservations.totalPages);
    this.loading$ = this.store.select(state => state.reservations.loading);
  }

  ngOnInit(): void {
    this.instructorId = this.authService.currentUserValue?.user?.id || null;

    if (!this.instructorId) {
      console.error("No instructor ID found. User may not be logged in or not an instructor.");
      return;
    }

    this.route.queryParams.subscribe(params => {
      if (params['workshopId']) {
        this.selectedWorkshopId = +params['workshopId'];
      }

      this.loadInstructorWorkshops();

      this.loadUsers();
    });
  }

 
  loadInstructorWorkshops(): void {
    if (!this.instructorId) return

    this.workshopService.getWorkshops({ page: 0, size: 10, filterByUser: this.instructorId }).subscribe({
      next: (response: PaginatedResponse<Workshop>) => {
        this.workshops = response.content
        this.loadReservationsViaStore();
      },
      error: (error) => {
        console.error("Error loading workshops:", error)
      },
    })
  }

  loadReservationsViaStore(): void {
    this.store.dispatch(ReservationActions.loadReservations({
      filter: {
        workshopId: this.selectedWorkshopId,
        page: 0,
        size: 10
      }
    }));
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: any) => {
        this.users = users.content;
      },
      error: (error) => {
        console.error("Error loading users:", error);
      }
    });
  }

  onWorkshopFilterChange(workshopId: number | null): void {
    this.selectedWorkshopId = workshopId;

    this.store.dispatch(ReservationActions.loadReservations({
      filter: {
        workshopId,
        page: 0, 
        size: 10
      }
    }));
  }

  getWorkshopTitle(workshopId: number): string {
    const workshop = this.workshops.find(w => w.id === workshopId);
    return workshop ? workshop.title : "Unknown Workshop";
  }

  getCustomerName(customerId: number): string {
    const user = this.users.find(u => u.id === customerId);
    return user ? user.fullname : "Unknown Customer";
  }

  getCustomerEmail(customerId: number): string {
    const user = this.users.find(u => u.id === customerId);
    return user ? user.email : "Unknown Email";
  }

  goToPage(page: number): void {
    this.currentPage$.pipe(take(1)).subscribe(currentPage => {
      this.pageSize$.pipe(take(1)).subscribe(pageSize => {
        this.store.dispatch(ReservationActions.loadReservations({
          filter: {
            workshopId: this.selectedWorkshopId,
            page,
            size: pageSize
          }
        }));
      });
    });
  }

  nextPage(): void {
    this.currentPage$.pipe(take(1)).subscribe(currentPage => {
      this.totalPages$.pipe(take(1)).subscribe(totalPages => {
        if (currentPage < totalPages - 1) {
          this.goToPage(currentPage + 1);
        }
      });
    });
  }

  previousPage(): void {
    this.currentPage$.pipe(take(1)).subscribe(currentPage => {
      if (currentPage > 0) {
        this.goToPage(currentPage - 1);
      }
    });
  }

  updateReservationStatus(id: number, status: string): void {
    this.store.dispatch(ReservationActions.updateReservationStatus({ id, status }));
  }
}
