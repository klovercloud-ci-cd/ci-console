import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { AppListService } from '../app-list.service';
import { ApplicationModalComponent } from '../application-modal/application-modal.component';

// import { DataService } from './data.service';

@Component({
  selector: 'kcci-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent implements OnInit {
  openForm: boolean = false;
  isLoading: boolean = true;
  load: boolean = false;
  tableData: any = [];
  tableeData: any = [
    {
      _metadata: {
        id: 'f5affce0-a813-424f-a013-107db54be06a',
        is_webhook_enabled: true,
        labels: {
          CompanyId: '8a4474dd-3306-4275-acce-0fabb4162a88',
          OwnerId: '8a4474dd-3306-4275-acce-0fabb4162a88',
          ShopId: '8a4474dd-3306-4275-acce-0fabb4162a88',
        },
        name: 'test1',
      },
      status: 'ACTIVE',
      url: 'https://github.com/niloydeb1/testApp',
      webhook: {
        active: false,
        config: {
          content_type: '',
          insecure_ssl: '',
          url: '',
        },
        created_at: '0001-01-01T00:00:00Z',
        deliveries_url: '',
        events: null,
        id: '0',
        ping_url: '',
        test_url: '',
        type: '',
        updated_at: '0001-01-01T00:00:00Z',
        url: '',
      },
    },
    {
      _metadata: {
        id: '42f5414a-36ec-4c92-b3b5-004c55fe3719',
        is_webhook_enabled: false,
        labels: {
          CompanyId: '8a4474dd-3306-4275-acce-0fabb4162a88',
        },
        name: 'test2',
      },
      status: 'ACTIVE',
      url: 'https://github.com/shabrulislam2451/testapp',
      webhook: {
        active: false,
        config: {
          content_type: '',
          insecure_ssl: '',
          url: '',
        },
        created_at: '0001-01-01T00:00:00Z',
        deliveries_url: '',
        events: null,
        id: '0',
        ping_url: '',
        test_url: '',
        type: '',
        updated_at: '0001-01-01T00:00:00Z',
        url: '',
      },
    },
    {
      _metadata: {
        id: '12b73b96-937a-4ba4-a76e-b7b47ab0d6bf',
        is_webhook_enabled: false,
        labels: {
          CompanyId: '8a4474dd-3306-4275-acce-0fabb4162a88',
        },
        name: 'test3',
      },
      status: 'ACTIVE',
      url: 'https://github.com/shabrulislam2451/testapp',
      webhook: {
        active: false,
        config: {
          content_type: '',
          insecure_ssl: '',
          url: '',
        },
        created_at: '0001-01-01T00:00:00Z',
        deliveries_url: '',
        events: null,
        id: '0',
        ping_url: '',
        test_url: '',
        type: '',
        updated_at: '0001-01-01T00:00:00Z',
        url: '',
      },
    },
  ];
  displayedColumns = ['name', 'label', 'webhook', 'url', 'action'];
  checked = true;
  check = true;
  dataSource!: MatTableDataSource<any>;
  userPersonalInfo: any;
  user: any = this.auth.getUserData();
  companyID: any;
  repositoryId: any;
  objectKeys = Object.keys;
  Object = Object;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(
    private service: AppListService,
    private _toolbarService: ToolbarService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private userInfo: UserDataService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this._toolbarService.changeData({ title: 'Applications' });

    //@ts-ignore
    this.repositoryId = this.route.snapshot.paramMap.get('repoID');

    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
      this.service
        .getRepositoryInfo(this.companyID, this.repositoryId)
        .subscribe((response: any) => {
          this.dataSource = new MatTableDataSource(response.data.applications);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.matSort;
          this.isLoading = false;
          console.log('sss: ', response.data.applications);
        });
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.data = {
      repositoryId: this.repositoryId,
    };
    this.dialog.open(ApplicationModalComponent, dialogConfig);
  }

  editApp(e: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.panelClass = 'custom-modalbox';
    this.dialog.open(ApplicationModalComponent, dialogConfig);
    console.log('E:', e);
  }

  deleteApp(e: any) {
    console.log('Delete:', e);
    let data = {
      applications: [
        {
          _metadata: {
            id: e._metadata.id,
          },
        },
      ],
    };
    this.service
      .deleteApplication(data, this.companyID, this.repositoryId)
      .subscribe(
        (res) => {
          // if (res.status === 'success') {
          //   // this.isLoading = false;
          //   // this.router.navigate(['/auth/login']);
          //   // this.openSnackBar('Registration Successfull', '');
          //   console.log('Registration Successfull', '');
          // }
          console.log('Add Application response', res);
          // console.log(this.authService.getUserData(), 'USER');
        },
        (err) => {
          // this.openSnackBarError('Authentication Error', '');
          console.log('err', err);
        }
      );
  }

  clickMe() {
    this.openForm = !this.openForm;
  }

  onValChange(value: any) {}
  something() {
    this.load = !this.load;
  }
  filterData($event: any) {
    this.dataSource.filter = $event.target.value;
  }
}
