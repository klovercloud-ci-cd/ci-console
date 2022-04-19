import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackComponent } from './snack/snack.component';

@Injectable({
  providedIn: 'root'
})

export class SharedSnackbarService {

  //format should be: openSnackBar('message', '', duration , 'snackbar-type? panelClass')

  //panelClass: ['success-snackbar','warn-snackbar','notification-snackbar','error-snackbar'],

  constructor(private snackBar: MatSnackBar) { }

    openSnackBar(title:string,message:string,
      duration:number,panelClass:string) {
      this.snackBar.openFromComponent(SnackComponent, {
        duration: duration,
        data: { title: title , message: message, snackType: 'warn', panelClass: panelClass},
        panelClass: [panelClass],
      });
    }
}
