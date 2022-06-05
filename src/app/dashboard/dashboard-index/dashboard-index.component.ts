import  {
  AfterContentChecked,
  ChangeDetectorRef,
  ElementRef,
  OnInit,
  Renderer2} from '@angular/core';
import {
  Component,
  ViewChild,
} from '@angular/core';
import  { MatDialog } from '@angular/material/dialog';
import  { ToolbarService } from 'src/app/shared/services/toolbar.service';
import  { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'kcci-dashboard-index',
  templateUrl: './dashboard-index.component.html',
  styleUrls: ['./dashboard-index.component.scss'],
})
export class DashboardIndexComponent implements OnInit, AfterContentChecked {
  @ViewChild('textElement') textElement: ElementRef | any;

  private closeSubject: any;

  test:any =1

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private _toolbarService: ToolbarService,
    private renderer: Renderer2,
    private cdref: ChangeDetectorRef,
  ) {
    this._toolbarService.changeData({ title: 'Dashboard' });
  }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
}
