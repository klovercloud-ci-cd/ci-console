import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LighthouseInfoEditorComponent } from './lighthouse-info-editor.component';

describe('LighthouseInfoEditorComponent', () => {
  let component: LighthouseInfoEditorComponent;
  let fixture: ComponentFixture<LighthouseInfoEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LighthouseInfoEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LighthouseInfoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
