import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { PaginatedResponse } from '../../core/models/PaginatedResponse.model';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-instructor-management-component',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './instructor-management-component.component.html',
  styleUrl: './instructor-management-component.component.scss'
})
export class InstructorManagementComponentComponent implements OnInit {
  instructors: User[] = [];
  currentPage = 0;
  pageSize = 6;
  totalElements = 0;
  totalPages = 0;
  showDeleteModal = false;
  instructorToDelete: number | null = null;

  private apiBaseUrl = 'http://localhost:8081'
  

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
 }
 
  ngOnInit(): void {
    if (this.route.snapshot.data && this.route.snapshot.data['instructors']) {
      const paginatedResponse = this.route.snapshot.data['instructors'] as PaginatedResponse<User>;
      this.handlePaginatedResponse(paginatedResponse);
    } else {

      this.loadInstructors();
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/admin-dashboard/instructors') {
        this.loadInstructors();
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
  loadImage(url: string, instructor: User): void {
    console.log("load image",url)
    this.userService.loadImage(url).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        instructor.imageUrl = imageUrl;  
    
      },
      error: (error) => {
        console.error('Error loading image', error);
      }
    });
  }
 
  loadInstructors(): void {
    
    this.userService.getInstructorsWithPage(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.handlePaginatedResponse(response);
        console.log('Instructors loaded:', response.content);
      },
      error: (error) => {
        console.error('Error loading instructors:', error);
      }
    });
  }

  handlePaginatedResponse(response: PaginatedResponse<User>): void {
    this.instructors = response.content;
    this.totalElements = response.totalElements;
    this.totalPages = response.totalPages;

    this.instructors.forEach((instructor) => {
      if (instructor.imageUrl) {
        instructor.imageUrl = this.getFullImageUrl(instructor.imageUrl)
        console.log(instructor.imageUrl)
        this.loadImage(instructor.imageUrl, instructor);
}
    })
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadInstructors();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }


  
  addInstructor(): void {
    console.log("in add")
    this.router.navigate(['/admin-dashboard/instructors/new']);
  }

  updateInstructor(instructor: User): void {
    this.router.navigate([`/admin-dashboard/instructors/${instructor.id}`]);
  }

  deleteInstructor(id: number): void {
    this.instructorToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.instructorToDelete !== null) {
      this.userService.deleteUser(this.instructorToDelete).subscribe({
        next: (response) => {
          this.instructors = this.instructors.filter(i => i.id !== this.instructorToDelete);
          console.log(`Instructor with ID ${this.instructorToDelete} deleted successfully.`);
          this.loadInstructors();
          this.showDeleteModal = false;
          this.instructorToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting instructor:', error);
          this.showDeleteModal = false;
          this.instructorToDelete = null;
        }
      });
    }
  }


  cancelDelete(): void {
    this.showDeleteModal = false;
    this.instructorToDelete = null;
  }

  
}
