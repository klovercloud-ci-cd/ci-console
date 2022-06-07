import  { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import  { MatDialog} from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { AddCompanyComponent } from '../add-company/add-company.component';

@Component({
  selector: 'kcci-attach-company',
  templateUrl: './attach-company.component.html',
  styleUrls: ['./attach-company.component.scss']
})
export class AttachCompanyComponent implements OnInit {

  constructor(
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.openDialog()
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '45%';
    dialogConfig.panelClass = 'custom-modalbox';

    // dialogConfig.data = {
    //   companyID: this.companyID,
    // };
    this.dialog.open(AddCompanyComponent, dialogConfig);
  }


}
