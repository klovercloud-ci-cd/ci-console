import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEditorModalComponent } from './app-editor-modal.component';

describe('AppEditorModalComponent', () => {
  let component: AppEditorModalComponent;
  let fixture: ComponentFixture<AppEditorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppEditorModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
