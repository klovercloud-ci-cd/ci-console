import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { RepoServiceService } from 'src/app/repository/repo-service.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { AppListService } from '../app-list.service';
import { ApplicationModalComponent } from '../application-modal/application-modal.component';

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
  repoType:any;
  objectKeys = Object.keys;
  Object = Object;
  array:any;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(
    private service: AppListService,
    private _toolbarService: ToolbarService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private userInfo: UserDataService,
    private auth: AuthService,
    private repo: RepoServiceService,
    private navigateRoute: Router
  ) {}

  ngOnInit() {
    this._toolbarService.changeData({ title: 'Applications' });

    //@ts-ignore
    this.repositoryId = this.route.snapshot.paramMap.get('repoID');

    this.service.refreshNeeded$.subscribe(()=>{
      this.getAppList()
    })

    this.getAppList()

  }

  getAppList(){
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
      this.service
        .getRepositoryInfo(this.companyID, this.repositoryId)
        .subscribe((response: any) => {
          this.array = response;
          this.dataSource = new MatTableDataSource(response.data.applications);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.matSort;
          this.isLoading = false;
          console.log('RepoInfo: ', response.data.type);
          this.repoType = response.data.type;
        });
    });
  }
someRoute(e:any){

  this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
    this.userPersonalInfo = res;
    this.companyID = res.data.metadata.company_id;
    this.service
      .getRepositoryInfo(this.companyID, this.repositoryId)
      .subscribe((response: any) => {
        this.repoType = response.data.type;
        let data = {
          title: e._metadata.name,
          type: response.data.type,
          url: e.url,
          repoId:response.data.id,
          appId: e._metadata.id
        }
      console.log(data);
      //@ts-ignore
      const encodedString = btoa(JSON.stringify(data));
      console.log("Encoded Value: ",encodedString);
      
      const decodedData = function base64ToHex(str:any) {
        for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
            let tmp = bin.charCodeAt(i).toString(16);
            if (tmp.length === 1) tmp = "0" + tmp;
            hex[hex.length] = tmp;
        }
        return hex.join("");
    } 
    
  this.navigateRoute.navigate(['repository',response.data.id,'application',decodedData(encodedString)]);

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
 
          console.log('Delete Application response', res);
        },
        (err) => {
          // this.openSnackBarError('Authentication Error', '');
          console.log('err', err);
        }
      );
  }

  webUpdate(appId: any) {

      this.repositoryId = this.route.snapshot.paramMap.get('repoID');

      this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
        this.userPersonalInfo = res;
        this.companyID = res.data.metadata.company_id;
            this.isLoading = false;
            let queryPayload = {
            action: appId._metadata.is_webhook_enabled?'enable':'disable',
            companyId: this.companyID,
            repoId: this.repositoryId,
            url: appId.url,
            webhookId: appId.webhook.id
            }
            this.service.updateWebhook(queryPayload).subscribe((res:any)=>{
              console.log("Webhook response",res);
              
            },
            (err) =>{
              console.log(err);
              
            })
      });    
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
