import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantTestimonialsComponent } from './participant-testimonials.component';

describe('ParticipantTestimonialsComponent', () => {
  let component: ParticipantTestimonialsComponent;
  let fixture: ComponentFixture<ParticipantTestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantTestimonialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
