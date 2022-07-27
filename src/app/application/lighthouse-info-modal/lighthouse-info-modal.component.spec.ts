import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LighthouseInfoModalComponent } from './lighthouse-info-modal.component';

describe('LighthouseInfoModalComponent', () => {
  let component: LighthouseInfoModalComponent;
  let fixture: ComponentFixture<LighthouseInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LighthouseInfoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LighthouseInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
