import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTableComponentComponent } from './user-table-component.component';

describe('UserTableComponentComponent', () => {
  let component: UserTableComponentComponent;
  let fixture: ComponentFixture<UserTableComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTableComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserTableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
