import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';

@Component({
  selector: 'kcci-dashboard-index',
  templateUrl: './dashboard-index.component.html',
  styleUrls: ['./dashboard-index.component.scss'],
})
export class DashboardIndexComponent implements OnInit, AfterContentChecked {
  @ViewChild('textElement') textElement: ElementRef | any;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private _toolbarService: ToolbarService,
    private renderer: Renderer2,
    private cdref: ChangeDetectorRef
  ) {
    this._toolbarService.changeData({ title: 'Dashboard' });
  }

  ngOnInit(): void {
    // this.renderer.setStyle(this.textElement, 'color', 'blue');
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
