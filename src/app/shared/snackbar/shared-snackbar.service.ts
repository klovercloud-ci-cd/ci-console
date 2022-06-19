import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackComponent } from './snack/snack.component';

@Injectable({
  providedIn: 'root',
})
export class SharedSnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(title: string, message: string, panelClass: string) {
    this.snackBar.openFromComponent(SnackComponent, {
      duration: 5000,
      data: { title, message, snackType: 'warn', panelClass },
      panelClass: [panelClass],
    });
  }
}
