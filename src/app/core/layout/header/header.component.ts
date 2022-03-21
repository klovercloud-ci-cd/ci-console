import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(public dialog: MatDialog, private auth: AuthService) {}
  pageTitle: string = '';
  openDialog() {
    // this.dialog.open(DialogElementsExampleDialog);
    alert('User clicked!');
  }
  ngOnInit(): void {}

  logout() {
    this.auth.logOut();
  }
}
