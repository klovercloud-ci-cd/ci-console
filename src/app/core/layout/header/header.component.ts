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
  newNoticeCount: any =0;
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
  checkDubble: any[] = [];
  async ngOnInit(): Promise<void> {

    this.connectWs()

    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.wsService.wsData.subscribe(res=>{

        const socketRes:any = res;
        if (socketRes.status === 'INITIALIZING' || socketRes.status === 'FAILED' ||socketRes.status === 'SUCCESSFUL') {
          this.newNoticeCount = this.newNoticeCount+1
          if (socketRes.status === 'FAILED'){
            this.tostr.info(
              `Step: ${socketRes.step}`,
              'Process Failed!',
              {
                enableHtml: true,
                positionClass: 'toast-top-center',
                tapToDismiss: false,
              }
            );
          }
          if (socketRes.status === 'SUCCESSFUL'){
            this.tostr.info(
              `Step: ${socketRes.step}`,
              'Successful!',
              {
                enableHtml: true,
                positionClass: 'toast-top-center',
                tapToDismiss: false,
              }
            );
          }
        }
        if (socketRes.company_id === this.userPersonalInfo.data.metadata.company_id ){
          if (socketRes.status === 'INITIALIZING') {

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
                        //http://localhost:2022/repository/5d372397-28bf-4c27-a305-8681520403be/application?type=GITHUB&title=Test-application&url=aHR0cHM6Ly9naXRodWIuY29tL3plcm9tc2kvdGVzdC1hcHA%3D&repoId=5d372397-28bf-4c27-a305-8681520403be&appId=7ef757e6-adc3-4699-bb81-ddbac0522096&page=0&limit=5
                        const queryPerams = `?type=${type}&title=${title}&url=${gitUrl}&repoId=${repoId}&appId=${appId}&commitId=${commitId}`


                        const link = `repository/${processRes.data.repository_id}/application/${queryPerams}`;

                        if (
                          !this.checkDubble.find(
                            (element) => element.step == socketRes.step
                          )
                        ) {
                          this.checkDubble.push({
                            step:socketRes.step
                          })
                          this.wsService.wsData.subscribe(res=>{

                          })
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
      if (this.sendWS) {
        clearInterval(this.sendWS);
      }
      this.connectWs()
    }
    socket.onopen=(e)=>{
      this.sendWS = setInterval(() => {
        socket.send(' ');
      }, 300);
    }
  }
  logout() {
    this.auth.logOut();
  }

  openNotification() {
    this.newNoticeCount = 0
    this.notices= []
    this.next=''
    this.header.getNotification().subscribe((res:any)=>{
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
    })
  }
  nextLog(){
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
