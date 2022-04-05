import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPipelineComponent } from './application-pipeline.component';

describe('ApplicationPipelineComponent', () => {
  let component: ApplicationPipelineComponent;
  let fixture: ComponentFixture<ApplicationPipelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationPipelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationPipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
