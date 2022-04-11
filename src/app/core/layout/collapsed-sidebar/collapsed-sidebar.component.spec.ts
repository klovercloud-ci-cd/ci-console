import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsedSidebarComponent } from './collapsed-sidebar.component';

describe('CollapsedSidebarComponent', () => {
  let component: CollapsedSidebarComponent;
  let fixture: ComponentFixture<CollapsedSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollapsedSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsedSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
