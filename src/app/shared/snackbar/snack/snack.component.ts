import  { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import  { MatSnackBar} from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'kcci-snack',
  templateUrl: './snack.component.html',
  styleUrls: ['./snack.component.scss']
})
export class SnackComponent implements OnInit {
  closeBtnClass = '';

  constructor(
    private snackBar: MatSnackBar,@Inject(MAT_SNACK_BAR_DATA) public data: any) {
      // console.log(data);

     }

  ngOnInit(): void {
    switch(this.data.panelClass) {
      case 'sb-success':
        this.closeBtnClass = 'text-green-400';
        break;
      case 'sb-error':
        this.closeBtnClass = 'text-red-400';
        break;
      case 'sb-warn':
      this.closeBtnClass = 'text-dark-warn';
      break;
      case 'sb-notification':
      this.closeBtnClass = 'text-blue-400';
      break;
      default:

    }
  }

  closeSnackbar() {
    this.snackBar.dismiss()
  }
}
