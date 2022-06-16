import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/auth.service';
import { UserDataService } from '../../../shared/services/user-data.service';
import { SharedSnackbarService } from '../../../shared/snackbar/shared-snackbar.service';
import { PipelineService } from '../../../application/pipeline.service';
import { TokenService } from '../../../auth/token.service';
import { AppListService } from '../../../application/app-list.service';
import {WsService} from "../../../shared/services/ws.service";
import {HeaderService} from "../header.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  notices: any[]=[];
  next: string='';
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
    private header: HeaderService
  ) {}

  pageTitle = '';

  user: any = this.auth.getUserData();

  userPersonalInfo: any;

  sendWS: any;

  async ngOnInit(): Promise<void> {

    this.connectWs()
    /*/!*WS test data*!/
    const data =[
      {
        claim: 0,
        company_id: 'ca32b354-457b-495c-88bd-3b4b52305f9e',
        process_id: '7e6c31a1-0f94-4417-8bb5-79b43648be76',
        footmark: 'init_build_job1',
        log: 'EOF',
        reason: 'n/a',
        status: 'INITIALIZING',
        step: 'build',
      },
      {
        claim: 0,
        company_id: 'ca32b354-457b-495c-88bd-3b4b52305f9e',
        process_id: '7e6c31a1-0f94-4417-8bb5-79b43648be76',
        footmark: 'git_clone1',
        log: 'EOF',
        reason: 'n/a',
        status: 'PROCESSING',
        step: 'build',
      },
      {
        claim: 0,
        company_id: 'ca32b354-457b-495c-88bd-3b4b52305f9e',
        process_id: '7e6c31a1-0f94-4417-8bb5-79b43648be76',
        footmark: 'git_clone1',
        log: 'EOF',
        reason: 'n/a',
        status: 'PROCESSING',
        step: 'build',
      },
      {
        claim: 0,
        company_id: 'ca32b354-457b-495c-88bd-3b4b52305f9e',
        process_id: '7e6c31a1-0f94-4417-8bb5-79b43648be76',
        footmark: 'init_build_job1',
        log: 'EOF',
        reason: 'n/a',
        status: 'PROCESSING',
        step: 'build',
      },

      {
        claim: 0,
        company_id: 'ca32b354-457b-495c-88bd-3b4b52305f9e',
        process_id: '7e6c31a1-0f94-4417-8bb5-79b43648be76',
        footmark: 'git_clone1',
        log: 'EOF',
        reason: 'n/a',
        status: 'PROCESSING',
        step: 'build',
      },
      {
        claim: 0,
        company_id: 'ca32b354-457b-495c-88bd-3b4b52305f9e',
        process_id: '7e6c31a1-0f94-4417-8bb5-79b43648be76',
        footmark: 'init_build_job1',
        log: 'EOF',
        reason: 'n/a',
        status: 'PROCESSING',
        step: 'build',
      },
      {
        claim: 0,
        company_id: 'ca32b354-457b-495c-88bd-3b4b52305f9e',
        process_id: '7e6c31a1-0f94-4417-8bb5-79b43648be76',
        footmark: 'git_clone1',
        log: 'EOF',
        reason: 'n/a',
        status: 'PROCESSING',
        step: 'build',
      },
      {
        claim: 0,
        company_id: 'ca32b354-457b-495c-88bd-3b4b52305f9e',
        process_id: '7e6c31a1-0f94-4417-8bb5-79b43648be76',
        footmark: 'git_clone1',
        log: 'EOF',
        reason: 'n/a',
        status: 'PROCESSING',
        step: 'build',
      },
      {
        claim: 0,
        company_id: 'ca32b354-457b-495c-88bd-3b4b52305f9e',
        process_id: '7e6c31a1-0f94-4417-8bb5-79b43648be76',
        footmark: 'init_build_job1',
        log: 'EOF',
        reason: 'n/a',
        status: 'PROCESSING',
        step: 'build',
      },
      {
        claim: 0,
        company_id: 'ca32b354-457b-495c-88bd-3b4b52305f9e',
        process_id: '7e6c31a1-0f94-4417-8bb5-79b43648be76',
        footmark: 'git_clone1',
        log: 'EOF',
        reason: 'n/a',
        status: 'PROCESSING',
        step: 'build',
      },
      {
        claim: 0,
        company_id: 'ca32b354-457b-495c-88bd-3b4b52305f9e',
        process_id: '7e6c31a1-0f94-4417-8bb5-79b43648be76',
        footmark: 'init_build_job1',
        log: 'EOF',
        reason: 'n/a',
        status: 'PROCESSING',
        step: 'build',
      },
    ]
    let i = 0;
    setInterval(()=>{
      let socketRes
      if (i === 0) {
        socketRes = data[0];
      } else {
        socketRes = data[Math.floor(Math.random() * 10) + 1];
      }
        this.wsService.setWsData(socketRes);
      i = Math.floor(Math.random() * 10) + 1
    },3000)
*/

    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      console.log(this.userPersonalInfo,'user info ')
      this.wsService.wsData.subscribe(res=>{
        console.log(res,'socekt res from header')
        const socketRes:any = res;

        if (socketRes.company_id === this.userPersonalInfo.data.metadata.company_id ){
          if (socketRes.status === 'INITIALIZING') {
            localStorage.setItem('isFailed', 'false');
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
                        let checkDubble: any[] = [];
                        if (
                          !checkDubble.find(
                            (element) => element.step == socketRes.step
                          )
                        ) {
                          this.tostr.info(
                            `<a class="text-dark" href="${link}">Application: ${appRes.data._metadata.name}, Step: ${socketRes.step}</a>`,
                            'New Process Initializing!',
                            {
                              enableHtml: true,
                              positionClass: 'toast-top-center',
                              tapToDismiss: false,
                            }
                          );
                        }
                      });
                  });
              });
          }
        }
      })
    });

  }

  ngOnDestroy() {
    if (this.sendWS) {
      clearInterval(this.sendWS);
    }
  }
  connectWs(){
    const company_Id: string = this.auth.getUserData().metadata.company_id;
    const socket = this.pipelineLog.connectToSocket(company_Id);
    socket.onmessage = (e) => {
      if (e.data !== 'null') {

        const socketRes = JSON.parse(e.data);

        this.wsService.setWsData(socketRes);

      }
    };
    socket.close =(e)=>{
      console.log('reconnecting')
      if (this.sendWS) {
        clearInterval(this.sendWS);
      }
      this.connectWs()
    }
    socket.onopen=(e)=>{
      console.log('socket connected')
      this.sendWS = setInterval(() => {
        socket.send(' ');
      }, 300);
    }
  }
  logout() {
    this.auth.logOut();
  }

  openNotification() {
    this.notices= []
    this.next=''
    this.header.getNotification().subscribe((res:any)=>{
      console.log("Response Notification:",res)
      for (let data of res.data){
        this.notices.push(data)
      }
      for (let link of res._metadata.links){
        if (link.next){
          this.next=link.next
        }
      }
      if (this.notices.length ==res._metadata.total_count){
        this.next=''
      }
      console.log(this.notices,this.next)
    })
  }
  nextLog(){
    console.log('next click');
    console.log("this.next",this.next)
    if (this.next !==''){
      this.header.getNextLog(this.next).subscribe((res:any)=>{
        if (res.data){
          for (let data of res?.data){
            this.notices.push(data)
          }
          for (let link of res._metadata.links){
            if (link.next){
              this.next=link.next
            }
          }
          if (this.notices.length ==res._metadata.total_count){
            this.next=''
          }
        }
      })
    }
  }
}
