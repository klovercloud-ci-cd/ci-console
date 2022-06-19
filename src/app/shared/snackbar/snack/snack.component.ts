import {OnInit} from '@angular/core';
import {Component, Inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'kcci-snack',
  templateUrl: './snack.component.html',
  styleUrls: ['./snack.component.scss'],
})

export class SnackComponent implements OnInit {
  closeBtnClass = '';
  icon: string = '';
  status: string = '';

  constructor(
    private snackBar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    switch (this.data.panelClass) {
      case 'sb-success':
        this.closeBtnClass = 'text-dark-500 hover:text-dark';
        this.status = 'text-success';
        this.icon = 'check_circle'
        break;
      case 'sb-error':
        this.closeBtnClass = 'text-dark-500 hover:text-dark';
        this.status = 'text-danger';
        this.icon = 'cancel'
        break;
      case 'sb-warn':
        this.closeBtnClass = 'text-dark-500 hover:text-dark';
        this.status = 'text-warn';
        this.icon = 'error_outline'
        break;
      case 'sb-notification':
        this.closeBtnClass = 'text-dark-500 hover:text-dark';
        this.status = 'text-info';
        this.icon = 'notifications'
        break;
      default:
    }
  }

  closeSnackbar() {
    this.snackBar.dismiss();
  }
}
