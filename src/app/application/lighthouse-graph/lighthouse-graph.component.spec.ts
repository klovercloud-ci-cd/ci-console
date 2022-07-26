import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LighthouseGraphComponent } from './lighthouse-graph.component';

describe('LighthouseGraphComponent', () => {
  let component: LighthouseGraphComponent;
  let fixture: ComponentFixture<LighthouseGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LighthouseGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LighthouseGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
