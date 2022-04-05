import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiCdPipelineComponent } from './ci-cd-pipeline.component';

describe('CiCdPipelineComponent', () => {
  let component: CiCdPipelineComponent;
  let fixture: ComponentFixture<CiCdPipelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CiCdPipelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CiCdPipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
