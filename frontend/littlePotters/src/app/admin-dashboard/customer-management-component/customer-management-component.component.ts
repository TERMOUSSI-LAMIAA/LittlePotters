import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-customer-management-component',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './customer-management-component.component.html',
  styleUrl: './customer-management-component.component.scss'
})
export class CustomerManagementComponentComponent implements OnInit {
  customers = [] as User[]; 
  constructor(private userService: UserService) { }
  ngOnInit(): void {

    this.loadCustomers();
  }
  
  loadCustomers(): void {
    this.userService.getCustomers().subscribe((data: User[]) => {
      this.customers = data;  
    });
  }
  deleteCustomer(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.loadCustomers(); 
    });
  }
}
