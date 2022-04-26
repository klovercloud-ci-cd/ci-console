import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineLogComponent } from './pipeline-log.component';

describe('PipelineLogComponent', () => {
  let component: PipelineLogComponent;
  let fixture: ComponentFixture<PipelineLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelineLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
