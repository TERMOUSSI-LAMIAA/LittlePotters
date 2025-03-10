import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurValuesCommitmentsComponent } from './our-values-commitments.component';

describe('OurValuesCommitmentsComponent', () => {
  let component: OurValuesCommitmentsComponent;
  let fixture: ComponentFixture<OurValuesCommitmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurValuesCommitmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurValuesCommitmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
