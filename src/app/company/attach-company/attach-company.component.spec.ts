import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachCompanyComponent } from './attach-company.component';

describe('AttachCompanyComponent', () => {
  let component: AttachCompanyComponent;
  let fixture: ComponentFixture<AttachCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
