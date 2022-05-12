import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { RepoServiceService } from '../repo-service.service';

@Component({
  selector: 'kcci-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
})
export class RepositoryComponent implements OnInit, AfterViewInit {
  repooArray: any = [
    {
      name: 'KloverCloud-CICD',
      type: 'github',
      application: 10,
    },
    {
      name: 'Circle-CI',
      type: 'gitlab',
      application: 8,
    },
    {
      name: 'We Pro',
      type: 'bitbucket',
      application: 12,
    },
    {
      name: 'Get Commerce',
      type: 'github',
      application: 10,
    },
    {
      name: 'KloverCloud-Endless',
      type: 'gitlab',
      application: 6,
    },
    {
      name: 'KloverCloud-Console',
      type: 'bitbucket',
      application: 7,
    },
    {
      name: 'KloverCloud-Endless',
      type: 'gitlab',
      application: 6,
    },
    {
      name: 'KloverCloud-Console',
      type: 'bitbucket',
      application: 7,
    },
  ];
  repoArray: any = [];
  user: any = this.auth.getUserData();
  companyID: any;
  userPersonalInfo: any;
  isLoading: boolean = true;
  constructor(
    private repoService: RepoServiceService,
    private _toolbarService: ToolbarService,
    private http: HttpClient,
    private userInfo: UserDataService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'Repositories' });

    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
      this.repoService
        .getCompanyInfo(this.companyID)
        .subscribe((response: any) => {
          this.isLoading = false;
          this.repoArray = response.data.repositories;
        });
    });
  }
  ngAfterViewInit(): void {}
}
