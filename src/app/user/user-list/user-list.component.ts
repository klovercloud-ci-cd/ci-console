import { OnDestroy, OnInit } from '@angular/core';
import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { AddCompanyComponent } from 'src/app/company/add-company/add-company.component';
import { DeleteConformationDialogComponent } from 'src/app/core/components/delete-conformation-dialog/delete-conformation-dialog.component';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { UserService } from '../user.service';
import {ResourcePermissionService} from "../../shared/services/resource-permission.service";
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";

@Component({
  selector: 'kc-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  @HostListener('window:resize', ['$event'])
  isAlive = true;

  isLoading = false;

  listLoading = true;

  hasCompany: any;

  queryParams = {
    status: 'active',
  };

  // Table
  displayedColumns: string[] = [
    'email',
    'name',
    'number',
    'status',
    'created',
    'actions',
  ];

  dataSource: any[] = [];

  currentUser: any;

  dialogWidth: any;

  constructor(
    private _userService: UserService,
    private _toolbarService: ToolbarService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    public resource: ResourcePermissionService,
    private snack: SharedSnackbarService,
  ) {
    this.currentUser = this.authService.getUserData();
  }

  public getScreenWidth: any;

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this._toolbarService.changeData({ title: 'Settings' });
    if (this.currentUser.metadata.company_id) {
      this.hasCompany = true;
      this.getUsers();
    } else {
      this.hasCompany = false;
      this.openDialog();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth < 1400) {
      this.dialogWidth = '70%';
    } else {
      this.dialogWidth = '45%';
    }
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '45vw';

    // dialogConfig.data = {
    //   companyID: this.companyID,
    // };
    this.dialog.open(AddCompanyComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  getUsers(): void {
    this.isLoading = true;
    this._userService.getUsers(this.queryParams).subscribe(
      (res) => {
        this.isLoading = false;
        this.dataSource = res?.data;
      },
      (err) => {
      }
    );
  }

  onDelete(user: any): void {

    const dialogRef = this.dialog.open(DeleteConformationDialogComponent, {
      data: {
        message: `Are you sure! You want to delete "${user?.email}" user?`,
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._userService.deleteUser(user).subscribe(
          (res) => {
            this.snack.openSnackBar('Delete initiated','','sb-success');
          },
          (err) => {
            this.snack.openSnackBar('Delete failed','','sb-error');
          }
        );
      }
    });
  }
}
