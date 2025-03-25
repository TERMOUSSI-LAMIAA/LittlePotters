import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PaginatedResponse } from '../../core/models/PaginatedResponse.model';

@Component({
  selector: 'app-customer-management-component',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './customer-management-component.component.html',
  styleUrl: './customer-management-component.component.scss'
})
export class CustomerManagementComponentComponent implements OnInit {
  customers: User[] = [];
  currentPage = 0;
  pageSize = 6;
  totalElements = 0;
  totalPages = 0;
  showDeleteModal = false;
  customerToDelete: number | null = null;
  private apiBaseUrl = 'http://localhost:8081'; 
  
  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    if (this.route.snapshot.data && this.route.snapshot.data['customers']) {
      const paginatedResponse = this.route.snapshot.data['customers'] as PaginatedResponse<User>;
      this.handlePaginatedResponse(paginatedResponse);
    } else {
      this.loadCustomers();
    }
  }
  
  loadCustomers(): void {
    this.userService.getCustomersWithPage(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.handlePaginatedResponse(response);
        console.log('Customers loaded:', response.content);
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });
  }

  getFullImageUrl(relativeUrl: string): string {
    if (!relativeUrl || relativeUrl.startsWith("http")) {
      return relativeUrl;
    }

    const baseUrl = this.apiBaseUrl.endsWith("/") ? this.apiBaseUrl.slice(0, -1) : this.apiBaseUrl;
    const imageUrl = relativeUrl.startsWith("/") ? relativeUrl : `/${relativeUrl}`;

    return `${baseUrl}${imageUrl}`;
  }

  loadImage(url: string, customer: User): void {
    this.userService.loadImage(url).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        customer.imageUrl = imageUrl;
      },
      error: (error) => {
        console.error('Error loading image', error);
      }
    });
  }

  handlePaginatedResponse(response: PaginatedResponse<User>): void {
    this.customers = response.content;
    this.totalElements = response.totalElements;
    this.totalPages = response.totalPages;

    this.customers.forEach((customer) => {
      if (customer.imageUrl) {
        customer.imageUrl = this.getFullImageUrl(customer.imageUrl);
        this.loadImage(customer.imageUrl, customer);
      }
    });
  }


  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadCustomers();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  deleteCustomer(id: number): void {
    this.customerToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.customerToDelete !== null) {
      this.userService.deleteUser(this.customerToDelete).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.id !== this.customerToDelete);
          console.log(`Customer with ID ${this.customerToDelete} deleted successfully.`);
          this.showDeleteModal = false;
          this.customerToDelete = null;
          this.loadCustomers(); 
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          this.showDeleteModal = false;
          this.customerToDelete = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.customerToDelete = null;
  }
}
