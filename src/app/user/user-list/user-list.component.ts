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

  userList: any = [
    {
      metadata: {
        company_id: 'f25a2224-b1b2-46f0-9d57-52947d9052b3',
        first_name: '',
        last_name: '',
      },
      id: '49a742c8-50cd-41a5-92c2-798d87d466e9',
      first_name: 'klovercloud',
      last_name: 'Admin',
      email: 'klovercloud.admin@klovercloud.com',
      phone: '01521339629',
      password: '$2a$10$3Kmxy2CV6BXWeGYjZeeOg.m.pjb4S2TWTSzNpbou3BmaPbdsOcvCy',
      status: 'active',
      created_date: '2022-05-18T11:11:00.935Z',
      updated_date: '2022-05-18T11:11:00.935Z',
      auth_type: 'password',
      resource_permission: {
        resources: [
          {
            name: 'user',
            roles: [
              {
                name: 'ADMIN',
              },
            ],
          },
          {
            name: 'company',
            roles: [
              {
                name: 'ADMIN',
              },
            ],
          },
          {
            name: 'cost_management',
            roles: [
              {
                name: 'ADMIN',
              },
            ],
          },
        ],
      },
    },
    {
      metadata: {
        company_id: 'f25a2224-b1b2-46f0-9d57-52947d9052b3',
        first_name: '',
        last_name: '',
      },
      id: '49a742c8-50cd-41a5-92c2-798d87d466e9',
      first_name: 'klovercloud',
      last_name: 'CI_CD',
      email: 'kc-cicd.admin@klovercloud.com',
      phone: '01545127895',
      password: '$2a$10$3Kmxy2CV6BXWeGYjZeeOg.m.pjb4S2TWTSzNpbou3BmaPbdsOcvCy',
      status: 'active',
      created_date: '2022-05-18T11:11:00.935Z',
      updated_date: '2022-05-18T11:11:00.935Z',
      auth_type: 'password',
      resource_permission: {
        resources: [
          {
            name: 'user',
            roles: [
              {
                name: 'ADMIN',
              },
            ],
          },
          {
            name: 'company',
            roles: [
              {
                name: 'ADMIN',
              },
            ],
          },
          {
            name: 'cost_management',
            roles: [
              {
                name: 'ADMIN',
              },
            ],
          },
        ],
      },
    },
  ];

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
    private authService: AuthService
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
    console.log('this.getScreenWidth', this.getScreenWidth);

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
    // dialogConfig.width = '45%';
    dialogConfig.panelClass = 'custom-modalbox';

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
        console.log('res?.data: ', res?.data);
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
        this.snackBar.open(err?.error?.message || "Can't fetch users");
      }
    );
  }

  onDelete(user: any): void {
    console.log('user:', user);

    const dialogRef = this.dialog.open(DeleteConformationDialogComponent, {
      data: {
        message: `Are you sure! You want to delete "${user?.email}" user?`,
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._userService.deleteUser(user).subscribe(
          (res) => {
            this.snackBar.open('Delete initiated', 'close', { duration: 5000 });
          },
          (err) => {
            console.log(err);
            this.snackBar.open(err.error.message, 'close', { duration: 5000 });
          }
        );
      }
    });
  }
}
