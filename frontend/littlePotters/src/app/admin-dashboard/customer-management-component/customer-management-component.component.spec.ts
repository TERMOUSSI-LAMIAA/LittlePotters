import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerManagementComponentComponent } from './customer-management-component.component';

describe('CustomerManagementComponentComponent', () => {
  let component: CustomerManagementComponentComponent;
  let fixture: ComponentFixture<CustomerManagementComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerManagementComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerManagementComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
