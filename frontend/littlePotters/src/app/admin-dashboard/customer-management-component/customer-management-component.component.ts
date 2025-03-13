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

  handlePaginatedResponse(response: PaginatedResponse<User>): void {
    this.customers = response.content;
    this.totalElements = response.totalElements;
    this.totalPages = response.totalPages;
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
