import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutLittlePottersComponent } from './about-little-potters.component';

describe('AboutLittlePottersComponent', () => {
  let component: AboutLittlePottersComponent;
  let fixture: ComponentFixture<AboutLittlePottersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutLittlePottersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutLittlePottersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
