import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HBarSComponent } from './h-bar-s.component';

describe('HBarSComponent', () => {
  let component: HBarSComponent;
  let fixture: ComponentFixture<HBarSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HBarSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HBarSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
