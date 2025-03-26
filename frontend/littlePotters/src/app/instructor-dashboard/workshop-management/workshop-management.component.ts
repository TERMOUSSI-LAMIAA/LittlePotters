import { Component } from '@angular/core';
import { Workshop } from '../../core/models/workshop.model';
import { WorkshopService } from '../../core/services/workshop.service';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaginatedResponse } from '../../core/models/PaginatedResponse.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workshop-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './workshop-management.component.html',
  styleUrl: './workshop-management.component.scss'
})
export class WorkshopManagementComponent {
  workshops: Workshop[] = []
  loading = false
  showForm = false
  currentPage = 0
  pageSize = 6
  totalElements = 0
  totalPages = 0
  showDeleteModal = false
  workshopToDelete: number | null = null
  apiBaseUrl = "http://localhost:8081"

  filterByUser = false;
  
  
  constructor(
    private workshopService: WorkshopService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    if (this.route.snapshot.data && this.route.snapshot.data['workshops']) {
      const paginatedResponse = this.route.snapshot.data['workshops'] as PaginatedResponse<Workshop>;
      this.handlePaginatedResponse(paginatedResponse);
    } else {
      this.loadWorkshops();
    }
    this.route.children.length > 0 ? (this.showForm = true) : (this.showForm = false);
    this.router.events.subscribe(() => {
      this.showForm = this.route.children.length > 0;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/admin-dashboard/workshops') {
        this.loadWorkshops();
      }
    });
    this.workshopService.workshopChanged$.subscribe(() => {
      console.log('Workshop changed, reloading list');
      this.loadWorkshops();
    });
  }

  applyFilter(): void {
    this.currentPage = 0; 
    this.loadWorkshops();
  }
  loadWorkshops(): void {
    this.loading = true;

    const filterParams = {
      page: this.currentPage,
      size: this.pageSize,
      filterByUser: this.filterByUser ? this.authService.currentUserValue?.user.id : undefined, 
    };

    this.workshopService.getWorkshops(filterParams).subscribe({
      next: (response) => {
        this.handlePaginatedResponse(response);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading workshops:', error);
        this.loading = false;
      },
    });
  }


  handlePaginatedResponse(response: PaginatedResponse<Workshop>): void {
    this.workshops = response.content;
    this.totalElements = response.totalElements;
    this.totalPages = response.totalPages;
    this.workshops.forEach((workshop) => {
      if (workshop.imageUrl) {
        workshop.imageUrl = this.getFullImageUrl(workshop.imageUrl);
        this.loadImage(workshop.imageUrl, workshop);
      }
    });
  }


  getFullImageUrl(relativeUrl: string): string {
    if (!relativeUrl || relativeUrl.startsWith("http")) {
      return relativeUrl
    }

    const baseUrl = this.apiBaseUrl.endsWith("/") ? this.apiBaseUrl.slice(0, -1) : this.apiBaseUrl
    const imageUrl = relativeUrl.startsWith("/") ? relativeUrl : `/${relativeUrl}`

    return `${baseUrl}${imageUrl}`
  }
  
  loadImage(url: string, workshop: Workshop): void {
    this.workshopService.loadWorkshopImage(url).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob)
        workshop.imageUrl = imageUrl
      },
      error: (error) => {
        console.error('Error loading workshop image:', error)
      }
    })
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

  addWorkshop(): void {
    this.router.navigate(["new"], { relativeTo: this.route })
  }

  editWorkshop(id: number): void {
    this.router.navigate([id], { relativeTo: this.route })
  }

  viewReservations(workshopId: number): void {
    this.router.navigate(["/instructor-dashboard/reservations"], {
      queryParams: { workshopId: workshopId },
    })
  }

  deleteWorkshop(id: number): void {
    this.workshopToDelete = id
    this.showDeleteModal = true
  }

  confirmDelete(): void {
    if (this.workshopToDelete !== null) {
      this.workshopService.deleteWorkshop(this.workshopToDelete).subscribe({
        next: () => {
          this.workshops = this.workshops.filter((w) => w.id !== this.workshopToDelete)
          this.loadWorkshops()
          this.showDeleteModal = false
          this.workshopToDelete = null
        },
        error: (error) => {
          console.error("Error deleting workshop:", error)
          this.showDeleteModal = false
          this.workshopToDelete = null
        },
      })
    }
  }

  isWorkshopOwner(workshop: Workshop): boolean {
    const currentUser = this.authService.currentUserValue;
    return !!currentUser && workshop.instructorId === currentUser.user.id;
  }

  cancelDelete(): void {
    this.showDeleteModal = false
    this.workshopToDelete = null
  }
}
