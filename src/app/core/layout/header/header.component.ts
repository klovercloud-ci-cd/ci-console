import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../auth/auth.service';
import {UserDataService} from '../../../shared/services/user-data.service';
import {SharedSnackbarService} from '../../../shared/snackbar/shared-snackbar.service';
import {PipelineService} from '../../../application/pipeline.service';
import {TokenService} from '../../../auth/token.service';
import {AppListService} from '../../../application/app-list.service';
import {WsService} from '../../../shared/services/ws.service';
import {HeaderService} from '../header.service';
import {Router} from '@angular/router';
import {findWhere} from "underscore";
import {Subscription} from "rxjs";
import {GlobalConstants} from "../../../shared/global-constants";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  notices: any[] = [];
  next: string = '';
  newNoticeCount: any = 0;
  subscribeId!: Subscription;
  title = GlobalConstants.siteTitle;
  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private userInfo: UserDataService,
    private snackBar: SharedSnackbarService,
    private tostr: ToastrService,
    private pipelineLog: PipelineService,
    private tokenService: TokenService,
    private applist: AppListService,
    private wsService: WsService,
    private header: HeaderService,
    private navigateRoute: Router
  ) {
  }

  pageTitle = '';

  user: any = this.auth.getUserData();

  userPersonalInfo: any;
  notification: any = [];

  sendWS: any;
  checkDubble: any[] = [];
  checkFailed: any[] = [];
  checkSuccessfull: any[] = [];
  checkInitializing: any[] = [];

  async ngOnInit(): Promise<void> {
    this.connectWs();
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.subscribeId = this.wsService.wsData.subscribe((res) => {
        const socketRes: any = res;

        if (
          socketRes.status === 'INITIALIZING' ||
          socketRes.status === 'FAILED' ||
          socketRes.status === 'SUCCESSFUL'
        ) {
          this.newNoticeCount = this.newNoticeCount + 1;
          if (socketRes.status === 'FAILED') {
            this.applist
              .getProcessDetails(socketRes.process_id)
              .subscribe((processRes: any) => {
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
                        const gitUrl = btoa(appRes.data.url);
                        const title = appRes.data._metadata.name;
                        const commitId = processRes.data.commit_id;
                        const type = repoRes.data.type;
                        const repoId = processRes.data.repository_id;
                        const appId = processRes.data.app_id;
                        const queryPerams = `?type=${type}&title=${title}&url=${gitUrl}&repoId=${repoId}&appId=${appId}&commitId=${commitId}`;
                        const link = `repository/${processRes.data.repository_id}/application/${queryPerams}`;

                        const infoToaster = this.tostr.warning(`Step: ${socketRes.step}`, 'Process Failed!', {
                          enableHtml: true,
                          positionClass: 'toast-top-center',
                          tapToDismiss: false,
                          progressBar: true,
                        });
                        infoToaster.onTap.subscribe(action => {
                          this.navigateRoute
                            .navigate([`repository/${processRes.data.repository_id}/application/`],
                                {
                                queryParams: {
                                  type: type,
                                  title: title,
                                  url: gitUrl,
                                  repoId: repoId,
                                  appId: appId,
                                  commitId: commitId,
                                },
                              }
                            )
                            .then(() => {
                            });
                        });
                        // }
                        // this.checkInitializing.push(socketRes.footmark);
                        // }
                        // }
                      });
                  });
              });



          }
          if (socketRes.status === 'SUCCESSFUL') {
            this.applist
              .getProcessDetails(socketRes.process_id)
              .subscribe((processRes: any) => {
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
                        const gitUrl = btoa(appRes.data.url);
                        const title = appRes.data._metadata.name;
                        const commitId = processRes.data.commit_id;
                        const type = repoRes.data.type;
                        const repoId = processRes.data.repository_id;
                        const appId = processRes.data.app_id;
                        const queryPerams = `?type=${type}&title=${title}&url=${gitUrl}&repoId=${repoId}&appId=${appId}&commitId=${commitId}`;
                        const link = `repository/${processRes.data.repository_id}/application/${queryPerams}`;

                        const infoToaster = this.tostr.success(`Step: ${socketRes.step}`, 'Successful!', {
                          enableHtml: true,
                          positionClass: 'toast-top-center',
                          tapToDismiss: false,
                          progressBar: true,
                        });
                        infoToaster.onTap.subscribe(action => {
                          this.navigateRoute
                            .navigate([`repository/${processRes.data.repository_id}/application`],
                              {
                              queryParams: {
                                type: type,
                                title: title,
                                url: gitUrl,
                                repoId: repoId,
                                appId: appId,
                                commitId: commitId,
                              },
                            }
                            )
                            .then(() => {
                            });
                        });
                        // }
                        // this.checkInitializing.push(socketRes.footmark);
                        // }
                        // }
                      });
                  });
              });

          }
        }
        if (socketRes.company_id === this.userPersonalInfo.data.metadata.company_id) {
          if (socketRes.status === 'INITIALIZING') {
            this.notification.push(socketRes);

            this.applist
              .getProcessDetails(socketRes.process_id)
              .subscribe((processRes: any) => {
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
                        const gitUrl = btoa(appRes.data.url);
                        const title = appRes.data._metadata.name;
                        const commitId = processRes.data.commit_id;
                        const type = repoRes.data.type;
                        const repoId = processRes.data.repository_id;
                        const appId = processRes.data.app_id;
                        const queryPerams = `?type=${type}&title=${title}&url=${gitUrl}&repoId=${repoId}&appId=${appId}&commitId=${commitId}`;
                        const link = `repository/${processRes.data.repository_id}/application/${queryPerams}`;

                        // if (
                        //   !this.checkDubble.find(
                        //     (element) => element.step == socketRes.step
                        //   )
                        // ) {
                        //   this.checkDubble.push({
                        //     step: socketRes.step,
                        //   });
                        // this.wsService.wsData.subscribe((res) => {
                        // });
                        // if (!this.checkInitializing.find((element) => element == socketRes.footmark)) {
                        //   this.checkInitializing.push(socketRes.footmark);

                        // this.checkInitializing.push(socketRes.footmark);
                        // for(let item of this.checkInitializing){
                        //   if(item===socketRes.footmark){
                        //   }
                        // }
                        const infoToaster = this.tostr.info(
                          `<a class="text-dark" href="${link}">Application: ${appRes.data._metadata.name}, Step: ${socketRes.step}</a>`,
                          'New Process Initializing!',
                          {
                            enableHtml: true,
                            positionClass: 'toast-top-center',
                            tapToDismiss: false,
                            progressBar: true,
                            newestOnTop: true,
                          }
                        );
                        infoToaster.onTap.subscribe(action => {
                          this.navigateRoute
                            .navigate([`repository/${processRes.data.repository_id}/application/`], {
                              queryParams: {
                                type: type,
                                title: title,
                                url: gitUrl,
                                repoId: repoId,
                                appId: appId,
                                commitId: commitId,
                              },
                            })
                            .then(() => {});
                        });
                        // }
                        // this.checkInitializing.push(socketRes.footmark);
                        // }
                        // }
                      });
                  });
              });


          }
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.sendWS) {
      clearInterval(this.sendWS);
    }
  }
  connectWs() {
    const company_Id: string = this.auth.getUserData().metadata.company_id;
    const socket = this.pipelineLog.connectToSocket(company_Id);

    socket.onopen = function() {
    }

    socket.onmessage = (e) => {
      this.title.add(this.sendWS);
      const text='';
      if (e.data !== 'null') {
        const socketRes = JSON.parse(e.data);
        this.wsService.setWsData(socketRes);
      }
    };
    this.sendWS = setInterval(function() {
        socket.send('Hello, Server!');
      }, 1000);
  }

  logout() {
    this.auth.logOut();
  }

  openNotification() {
    this.newNoticeCount = 0;
    this.notices = [];
    this.next = '';
    this.header.getNotification().subscribe((res: any) => {
      for (let data of res.data) {
        this.notices.push(data);
      }
      for (let link of res._metadata.links) {
        if (link.next) {
          this.next = link.next;
        }
      }
      if (this.notices.length == res._metadata.total_count) {
        this.next = '';
      }
    });
  }

  nextLog() {
    if (this.next !== '') {
      this.header.getNextLog(this.next).subscribe((res: any) => {
        if (res.data) {
          for (let data of res?.data) {
            this.notices.push(data);
          }
          for (let link of res._metadata.links) {
            if (link.next) {
              this.next = link.next;
            }
          }
          if (this.notices.length == res._metadata.total_count) {
            this.next = '';
          }
        }
      });
    }
  }

  navigateToProcess(processId: string) {
    this.applist.getProcessDetails(processId).subscribe((processRes: any) => {
      this.applist
        .getAppDetails(processRes.data.repository_id, processRes.data.app_id)
        .subscribe((appRes: any) => {
          appRes.data.url;
          this.applist
            .getRepositoryInfo(
              appRes.data._metadata.CompanyId,
              processRes.data.repository_id
            )
            .subscribe((repoRes) => {
              const gitUrl = btoa(appRes.data.url);
              const title = appRes.data._metadata.name;
              const commitId = processRes.data.commit_id;
              const type = repoRes.data.type;
              const repoId = processRes.data.repository_id;
              const appId = processRes.data.app_id;
              this.navigateRoute
                .navigateByUrl('/RefreshComponent', {
                  skipLocationChange: true,
                })
                .then(() => {
                  this.navigateRoute.navigate(
                    [
                      'repository',
                      repoId,
                      'application',
                      // decodedData(encodedString),
                    ],
                    {
                      queryParams: {
                        type: type,
                        title: title,
                        url: gitUrl,
                        repoId: repoId,
                        appId: appId,
                        commitId: commitId,
                      },
                    }
                  ).then(()=>{
                    window.location.reload();
                  })
                  ;
                });
            });
        });
    });
  }
}
