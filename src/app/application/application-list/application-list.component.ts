import { OnInit } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DeleteConformationDialogComponent } from 'src/app/core/components/delete-conformation-dialog/delete-conformation-dialog.component';
import { RepoServiceService } from 'src/app/repository/repo-service.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { AppListService } from '../app-list.service';
import { ApplicationModalComponent } from '../application-modal/application-modal.component';
import {AppEditorModalComponent} from "../app-editor-modal/app-editor-modal.component";
import {ResourcePermissionService} from "../../shared/services/resource-permission.service";

@Component({
  selector: 'kcci-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent implements OnInit {
  isLoading = true;

  load = false;

  displayedColumns = ['name', 'label', 'webhook', 'url', 'action'];

  checked = true;

  check = true;

  dataSource!: MatTableDataSource<any>;

  userPersonalInfo: any;

  user: any = this.auth.getUserData();

  companyID: any;

  repositoryId: any;

  repoType: any;

  objectKeys = Object.keys;

  Object = Object;

  array: any;

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
    private navigateRoute: Router,
    public resource: ResourcePermissionService
  ) {
    this._toolbarService.changeData({ title: 'Applications' });
  }

  ngOnInit() {
    // @ts-ignore
    this.repositoryId = this.route.snapshot.paramMap.get('repoID');

    this.service.refreshNeeded$.subscribe(() => {
      this.getAppList();
    });

    this.getAppList();
  }

  getAppList() {
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

  someRoute(e: any) {
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
      this.service
        .getRepositoryInfo(this.companyID, this.repositoryId)
        .subscribe((response: any) => {
          this.repoType = response.data.type;
          const data = {
            title: e._metadata.name,
            type: response.data.type,
            url: e.url,
            repoId: response.data.id,
            appId: e._metadata.id,
          };
          console.log(data);
          // @ts-ignore
          const encodedString = btoa(JSON.stringify(data));
          console.log('Encoded Value: ', encodedString);

          const decodedData = function base64ToHex(str: any) {
            for (
              var i = 0, bin = atob(str.replace(/[ \r\n]+$/, '')), hex = [];
              i < bin.length;
              ++i
            ) {
              let tmp = bin.charCodeAt(i).toString(16);
              if (tmp.length === 1) tmp = `0${tmp}`;
              hex[hex.length] = tmp;
            }
            return hex.join('');
          };

          this.navigateRoute.navigate([
            'repository',
            response.data.id,
            'application',
            decodedData(encodedString),
          ]);
        });
    });
  }

  openAppEditor(element:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%';
    dialogConfig.maxWidth = '600px'
    dialogConfig.data = {
      repositoryId: this.repositoryId,
      applicationURL: element.url
    };
    this.dialog.open(AppEditorModalComponent, dialogConfig);
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%';
    dialogConfig.maxWidth = '600px';
    dialogConfig.data = {
      repositoryId: this.repositoryId,
      step:1
    };
    this.dialog.open(ApplicationModalComponent, dialogConfig);
  }

  deleteApp(e: any) {
    console.log('Delete:', e._metadata.name);
    const data = {
      applications: [
        {
          _metadata: {
            id: e._metadata.id,
          },
        },
      ],
    };
    const dialogRef = this.dialog.open(DeleteConformationDialogComponent, {
      data: {
        message: `Are you sure! You want to delete "${e._metadata.name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
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
      )
      }
    });
  }

  webUpdate(appId: any) {
    this.repositoryId = this.route.snapshot.paramMap.get('repoID');

    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
      this.isLoading = false;
      const queryPayload = {
        action: appId._metadata.is_webhook_enabled ? 'enable' : 'disable',
        companyId: this.companyID,
        repoId: this.repositoryId,
        url: appId.url,
        webhookId: appId.webhook.id,
      };
      this.service.updateWebhook(queryPayload).subscribe(
        (res: any) => {
          console.log('Webhook response', res);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }
}
