import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { AddCompanyComponent } from 'src/app/company/add-company/add-company.component';
import { DeleteConformationDialogComponent } from 'src/app/core/components/delete-conformation-dialog/delete-conformation-dialog.component';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { RoleFormComponent } from '../role-form/role-form.component';
import { RoleService } from '../role.service';

@Component({
  selector: 'kc-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  
  isLoading!: boolean;
  hasCompany!: boolean ;
  displayedColumns: string[] = ['name', 'permission', 'actions'];
  dataSource: any[] = [];

  currentUser: any;

  constructor(private _roleService: RoleService,private _toolbarService: ToolbarService, private snackBar: MatSnackBar, private dialog: MatDialog, private authService: AuthService) {
    this.currentUser = this.authService.getUserData(); }

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'Settings' });
    this.getRoles();
    if(this.currentUser.metadata.company_id){
      this.hasCompany = true;
    }else{
      this.hasCompany = false;
      this.openDialog();
    }
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
  
  getRoles(): void {
    this.isLoading = true;
    this._roleService.getRoles().subscribe(res => {
      this.dataSource = res?.data;
      this.isLoading = false;
      console.log("res?.data:",res?.data);
      
    }, (err) => {
      this.isLoading = false;
      this.snackBar.open(err?.error?.message, 'Close', {
        duration: 5000
      })
    })
  }
  
  onDelete(role: any): void {
    const dialogRef = this.dialog.open(DeleteConformationDialogComponent, {
      data:{
        message: `Are you sure want to delete "${role?.name}" role?`,
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._roleService.deleteRole(role).subscribe(_ => {
          this.snackBar.open('Success! Role deleted', 'close', {duration: 5000});
          this.getRoles();
        }, err => {
          this.snackBar.open(err.error.message, 'close', {duration: 5000});
        });
      }
    });
  }
  
  createRole(): void {
    const dialogRef = this.dialog.open(RoleFormComponent, {
      disableClose: true,
      width: '100%',
      maxWidth: '600px'
    });
    dialogRef.afterClosed().subscribe((isCreated: boolean) => {
      if (isCreated) {
        this.getRoles();
      }
    });
  }
  
  updateRole(role: any): void {
    const dialogRef = this.dialog.open(RoleFormComponent, {
      disableClose: true,
      width: '100%',
      maxWidth: '600px',
      data: role
    });
    dialogRef.afterClosed().subscribe((isUpdated: boolean) => {
      if (isUpdated) {
        this.getRoles();
      }
    });
  }
}
