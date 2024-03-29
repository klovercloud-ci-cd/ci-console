import { HttpClient } from '@angular/common/http';
import { AfterViewInit, OnInit } from '@angular/core';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { RepoServiceService } from '../repo-service.service';
import { RepositoryModalComponent } from '../repository-modal/repository-modal.component';
import {ResourcePermissionService} from "../../shared/services/resource-permission.service";
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";

@Component({
  selector: 'kcci-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RepositoryComponent implements OnInit, AfterViewInit {
  repoArray: any = [];

  user: any = this.auth.getUserData();

  companyID: any;

  userPersonalInfo: any;

  isLoading = true;
  hasRepository:any;

  constructor(
    private repoService: RepoServiceService,
    private _toolbarService: ToolbarService,
    private http: HttpClient,
    private userInfo: UserDataService,
    private auth: AuthService,
    private dialog: MatDialog,
    public resource: ResourcePermissionService,
    private  snack : SharedSnackbarService,
  ) {
    this._toolbarService.changeData({ title: 'Repositories' });
  }

  ngOnInit(): void {
    this.repoService.refreshNeeded$.subscribe(() => {
      this.getRepoList();
    });
    this.getRepoList();
  }

  getRepoList() {
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
      this.repoService
        .getCompanyInfo(this.companyID)
        .subscribe((response: any) => {
          console.log('RepoResponse',response)
          if(response.data.repositories){
            this.hasRepository = true;
          }else{
            this.hasRepository=false;
          }
          this.isLoading = false;
          this.repoArray = response.data.repositories;
        },(err)=>{
          this.isLoading = false;
          this.hasRepository=false;
        });
    },(err)=>{
      this.isLoading = false;
    });
  }

  openDialog() {
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      console.log("Response:",res)
      this.companyID = res.data.metadata.company_id;
    });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '100%';
    dialogConfig.maxWidth = '600px';
    dialogConfig.data = {
      companyID: this.companyID,
    };
    this.dialog.open(RepositoryModalComponent, dialogConfig);
  }

  ngAfterViewInit(): void {}
}
