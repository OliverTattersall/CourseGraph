import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterInfoPageComponent } from './register-info-page.component';

describe('RegisterInfoPageComponent', () => {
  let component: RegisterInfoPageComponent;
  let fixture: ComponentFixture<RegisterInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterInfoPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
