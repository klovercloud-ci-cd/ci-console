import { Component, OnInit } from '@angular/core';
import {AddCompanyModalComponent} from "../add-company-modal/add-company-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'kcci-dashboard-index',
  templateUrl: './dashboard-index.component.html',
  styleUrls: ['./dashboard-index.component.scss']
})
export class DashboardIndexComponent implements OnInit {

  constructor(private dialog: MatDialog,private authService:AuthService) { }

  ngOnInit(): void {
    this.dialog.open(AddCompanyModalComponent,{
      panelClass: 'kc-dialog'
    })
  }

}
