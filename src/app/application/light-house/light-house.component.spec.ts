import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightHouseComponent } from './light-house.component';

describe('LightHouseComponent', () => {
  let component: LightHouseComponent;
  let fixture: ComponentFixture<LightHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightHouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
