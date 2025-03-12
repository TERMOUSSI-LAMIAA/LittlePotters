import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-instructor-management-component',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './instructor-management-component.component.html',
  styleUrl: './instructor-management-component.component.scss'
})
export class InstructorManagementComponentComponent implements OnInit {
  instructors: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadInstructors();
  }

  loadInstructors(): void {
    this.userService.getInstructors().subscribe({
      next: (response) => {
        this.instructors = response.content;
        console.log('Instructors loaded:', response.content);
      },
      error: (error) => {
        console.error('Error loading instructors:', error);
      }
    });
  }
  
  addInstructor(): void {
    console.log('Open Add Instructor Modal');
  }

  updateInstructor(instructor: User): void {
    console.log('Open Update Instructor Modal for:', instructor);
  }

  deleteInstructor(id: number): void {
    if (confirm('Are you sure you want to delete this instructor?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.instructors = this.instructors.filter(i => i.id !== id);
        console.log(`Instructor with ID ${id} deleted successfully.`);
      });
    }
  }
}
