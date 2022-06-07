import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/auth.service';
import { UserDataService } from '../../../shared/services/user-data.service';
import { SharedSnackbarService } from '../../../shared/snackbar/shared-snackbar.service';
import { PipelineService } from '../../../application/pipeline.service';
import { TokenService } from '../../../auth/token.service';
import { AppListService } from '../../../application/app-list.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private userInfo: UserDataService,
    private snackBar: SharedSnackbarService,
    private tostr: ToastrService,
    private pipelineLog: PipelineService,
    private tokenService: TokenService,
    private applist: AppListService
  ) {}

  pageTitle = '';

  user: any = this.auth.getUserData();

  userPersonalInfo: any;

  sendWS: any;

  async ngOnInit(): Promise<void> {
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
    });
    const company_Id: string = this.auth.getUserData().metadata.company_id;
    const socket = this.pipelineLog.connectToSocket(company_Id);
    socket.onmessage = (e) => {
      console.log(e.data);
      if (e.data !== 'null') {
        const socketRes = JSON.parse(e.data);
        console.log('processid', socketRes.process_id);
        if (socketRes.status === 'INITIALIZING') {
          this.applist
            .getProcessDetails(socketRes.process_id)
            .subscribe((processRes: any) => {
              console.log(processRes, 'api res');
              this.applist
                .getAppDetails(
                  processRes.data.repository_id,
                  processRes.data.app_id
                )
                .subscribe((appRes: any) => {
                  appRes.data.url;
                  this.applist
                    .getRepositoryInfo(
                      appRes.data._metadata.CompanyId,
                      processRes.data.repository_id
                    )
                    .subscribe((repoRes) => {
                      const queryPerams = {
                        title: appRes.data._metadata.name,
                        type: repoRes.data.type,
                        url: appRes.data.url,
                        repoId: processRes.data.repository_id,
                        appId: processRes.data.app_id,
                      };
                      function base64ToHex(str: any) {
                        for (
                          var i = 0,
                            bin = atob(str.replace(/[ \r\n]+$/, '')),
                            hex = [];
                          i < bin.length;
                          ++i
                        ) {
                          let tmp = bin.charCodeAt(i).toString(16);
                          if (tmp.length === 1) tmp = `0${tmp}`;
                          hex[hex.length] = tmp;
                        }
                        return hex.join('');
                      }
                      const encodedString = btoa(JSON.stringify(queryPerams));
                      const base64 = base64ToHex(encodedString);
                      const link = `repository/${processRes.data.repository_id}/application/${base64}`;
                      console.log(link);
                      this.tostr.info(
                        `<a href="${link}">Application: ${appRes.data._metadata.name}, Step: ${socketRes.step}</a>`,
                        'New Process Initializing!',
                        {
                          closeButton: true,
                          disableTimeOut: true,
                          enableHtml: true,
                          positionClass: 'toast-top-center',
                          tapToDismiss: false,
                        }
                      );
                    });
                });
            });
        }
      }
    };
    this.sendWS = setInterval(() => {
      socket.send(' ');
    }, 300);
  }

  ngOnDestroy() {
    if (this.sendWS) {
      clearInterval(this.sendWS);
    }
  }

  logout() {
    this.auth.logOut();
  }

  testClick() {}
}
