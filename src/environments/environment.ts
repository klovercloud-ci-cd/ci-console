
const webappUrl = 'http://localhost:2022';

export const environment = {
  appUrl: webappUrl,
  production: true,
  // v1AuthEndpoint: 'http://192.168.68.147:8085/api/v1/',
  // v1ApiEndPoint: 'http://192.168.68.147:8080/api/v1/',
  // v1ApiEndPointWS: 'ws://192.168.68.147:8080/api/v1/',
  v1AuthEndpoint: 'http://192.168.68.141:8081/api/v1/',
  v1ApiEndPoint: 'http://192.168.68.141:8080/api/v1/',
  v1ApiEndPointWS: 'ws://192.168.68.141:8080/api/v1/',
}



// <!--                New Log Panel-->
// <!--                -->
// <!--                <div class="flex justify-center">-->
// <!--                  <div #pipelineLogViewContainer class="overflow-y-scroll h-[288px] scroll-smooth w-full text-center">-->
// <!--                    <div class="px-3  h-full w-full" id="{{'scrollArea'+foot}}">-->
// <!--                      <div class="h-full">-->
// <!--                       <span *ngFor="let logDetails of logs">-->
// <!--                      <span *ngIf="logDetails.name === foot" class="space-y-2">-->
// <!--                        <pre-->
// <!--                          *ngFor="let log of logDetails.data"-->
// <!--                          class=" text-white text-sm break-words flex"-->
// <!--                          [innerHTML]="log"-->
// <!--                        >{{ log }}</pre>-->
// <!--                      </span>-->
// <!--                     </span>-->
// <!--                      </div>-->
// <!--                      <div class="my-3 h-5" id="{{'intObj'+foot}}"></div>-->
// <!--                    </div>-->
// <!--                      <div *ngFor="let item of liveLogs">-->
// <!--                        <p class="py-3 text-light">{{item}}</p>-->
// <!--                      </div>-->
// <!--                      <pre *ngFor="let log of liveLogs" [innerHTML]="log">{{log}}</pre>-->
// <!--                    <span  class="terminal-spinner pb-16 pl-5"></span>-->
// <!--                  </div>-->
// <!--                </div>-->

// import {
//   AfterContentChecked,
//   AfterContentInit,
//   ChangeDetectorRef,
//   Component, ElementRef,
//   Input, OnDestroy,
//   OnInit, ViewChild, ViewChildren,
//   ViewEncapsulation,
// } from '@angular/core';
// import { ApplicationListComponent } from '../application-list/application-list.component';
// import { ToolbarService } from '../../shared/services/toolbar.service';
// import { HttpClient } from '@angular/common/http';
// import { ActivatedRoute, Router } from '@angular/router';
// import { UserDataService } from '../../shared/services/user-data.service';
// import { AuthService } from '../../auth/auth.service';
// import { AppListService } from '../app-list.service';
// import { RepoServiceService } from '../../repository/repo-service.service';
// import { PipelineService } from '../pipeline.service';
// import { WsService } from '../../shared/services/ws.service';
// import { ToastrService } from 'ngx-toastr';
// import { ProcessLifecycleEventService } from '../process-lifecycle-event.service';
// import { FormControl, FormGroup } from '@angular/forms';
// import { SharedSnackbarService } from '../../shared/snackbar/shared-snackbar.service';
//
// @Component({
//   selector: 'kcci-pipeline-graph',
//   templateUrl: './pipeline-graph.component.html',
//   styleUrls: ['./pipeline-graph.component.scss'],
//   encapsulation: ViewEncapsulation.None,
// })
// export class PipelineGraphComponent
//   implements OnInit, AfterContentChecked, AfterContentInit, OnDestroy
// {
//
//   @ViewChildren('pipelineLogViewContainer') pipelineLogViewContainer: any;
//   openBranch = 0;
//   openFootMark = 0;
//
//   public singleLogDetails: { footmark: any; index: number } = {
//     footmark: '',
//     index: 0,
//   };
//   openFootMarkName: any;
//   stepStatus: any;
//   socketres: any;
//   next: any;
//   prev: any;
//   self: any;
//   title: any;
//   initialPrevPage:number = 0;
//   liveLogs = [];
//   failed: any[] = [];
//   error: any = {
//     pipeline: '',
//   };
//   commitId: any;
//   logClaim: any;
//
//   setOpenBranch(index: number) {
//     this.openBranch = index;
//   }
//
//   setActiveFootMark(index: number) {
//     this.openFootMark = index;
//   }
//
//   nextStep() {
//     this.openBranch++;
//   }
//
//   prevStep() {
//     this.openBranch--;
//   }
//
//   currentPage: number = 0;
//   name_count: number = 1;
//   c_page:any;
//   commitsPerCall: any;
//   newLogs: any[] = [];
//   branchName: any;
//   newBranchName: any;
//   pipeline: any;
//   pipelineStep: any;
//   envList: any;
//   stepsLists: any;
//   logOpen: boolean = false;
//   isLogLoading:boolean = false;
//   fullmode = false;
//   public branchs: any = [];
//   public footMarks: any[] = [];
//   public commitList: any[] = [];
//   urlParams: any;
//   repoId = this.route.snapshot.paramMap.get('repoID');
//   userInfo = this.auth.getUserData();
//   companyId = this.userInfo.metadata.company_id;
//   type: any;
//   repoUrl: any;
//   sendWS: any;
//
//   content: any = ApplicationListComponent;
//   public allFootMarks: any[] = [];
//   public processIds: any[] = [];
//   public footMarksLegth: number = 0;
//   logs: any[] = [];
//   prevStepName: string = '';
//   page: number = 1;
//   limit: any = 5;
//   skip: number = 0;
//   prev_logs_size: number = 0;
//   nodeDetails: any = '';
//   activeStep: any = '';
//   init = false;
//   commit: any;
//   isLoading = { graph: true, commit: true };
//   socket: any;
//   isObjerving: boolean = false;
//
//   constructor(
//     private _toolbarService: ToolbarService,
//     private http: HttpClient,
//     private route: ActivatedRoute,
//     private usersInfo: UserDataService,
//     private auth: AuthService,
//     private applist: AppListService,
//     private repo: RepoServiceService,
//     private cdref: ChangeDetectorRef,
//     private pipes: PipelineService,
//     private navigateRoute: Router,
//     private wsService: WsService,
//     private tostr: ToastrService,
//     private snackBar: SharedSnackbarService,
//     private processLifecycleEventService: ProcessLifecycleEventService
//   ) {
//     this.route.queryParams.subscribe((res) => {
//       this.title = res['title'];
//     });
//     this._toolbarService.changeData({ title: this.title });
//   }
//
//   ngAfterContentInit(): void {
//     this.wsService.wsData.subscribe((res) => {
//       this.socketres = res;
//       const socketRes: any = res;
//       console.log("Socket Response Initial", socketRes)
//       if (socketRes.process_id == this.pipeline?.data?.process_id) {
//         if (socketRes.status === 'INITIALIZING') {
//           this.init = true;
//           this.pipes
//             .getStepDetails(socketRes.step, socketRes.process_id)
//             .subscribe((res: any) => {
//               if (
//                 res?.data.status === 'active' ||
//                 res?.data.status === 'non_initialized'
//               ) {
//                 this.getPipeline(socketRes.process_id);
//                 this.openLogPanel(socketRes.step, socketRes.claim);
//                 setTimeout(() => {
//                   this.setActiveFootMark(0);
//                 }, 1000);
//               }
//             });
//         }
//         if (socketRes.status === 'PROCESSING') {
//           let faild = false;
//           for (let step of this.failed) {
//             if (step.name === socketRes.step) {
//               faild = true;
//             }
//           }
//           if (!this.init && !faild) {
//             this.init = true;
//             this.pipes
//               .getStepDetails(socketRes.step, socketRes.process_id)
//               .subscribe((res: any) => {
//                 if (res?.data.status === 'active') {
//                   this.getPipeline(socketRes.process_id);
//                   this.openLogPanel(socketRes.step, socketRes.claim);
//                 }
//               });
//           }
//         }
//         if (socketRes.status === 'FAILED' || socketRes.status === 'failed') {
//           this.pipes
//             .getStepDetails(socketRes.step, socketRes.process_id)
//             .subscribe((res: any) => {
//               if (res?.data.status === 'failed') {
//                 this.getPipeline(socketRes.process_id);
//               }
//             });
//         }
//         if (socketRes.status === 'SUCCESSFUL') {
//           this.init = false;
//           this.getPipeline(socketRes.process_id);
//         }
//       }
//     });
//   }
//
//   @Input() nodeName!: number | string;
//
//   ngOnDestroy() {
//     if (this.sendWS) {
//       clearInterval(this.sendWS);
//     }
//     // localStorage.removeItem('page');
//   }
//
//   ngOnInit() {
//     this.timeFunc();
//
//     this.route.queryParams.subscribe((res) => {
//       this.title = res['title'];
//       this.type = res['type'].toLowerCase() + 's';
//       this.repoUrl = atob(res['url']);
//       this.commitId = res['commitId'];
//       this.newBranchName = res['branch'];
//       // @ts-ignore
//       if(localStorage.getItem('page')){
//         // @ts-ignore
//         this.currentPage = parseInt(localStorage.getItem('page'));
//       }
//       // // @ts-ignore
//       // this.currentPage= parseInt(localStorage.getItem('page'));
//       if (res['page']) {
//         this.currentPage = Number(res['page']);
//       }
//       if (res['limit']) {
//         this.limit = res['limit'];
//       }
//     });
//
//     this.pipes
//       .getBranch(this.type, this.repoId, this.repoUrl)
//       .subscribe((res: any) => {
//         this.branchs = res.data;
//         this.branchName = this.branchs[0].name;
//         this.getCommit((this.newBranchName)?this.newBranchName:this.branchs[0].name);
//       });
//     this.navigateRoute
//       .navigate([], {
//         queryParams: { page: this.currentPage, limit: this.limit },
//         queryParamsHandling: 'merge',
//       })
//       .then((r) => {});
//   }
//
//   ngAfterContentChecked() {
//     this.cdref.detectChanges();
//   }
//
//   getCommit(branchName: any) {
//
//     let pageNumber:any;
//     // if(this.currentPage>0)
//     // {
//     //   branchName=this.currentPage;
//     // }else {
//     //   branchName = 0;
//     // }
//
//     if(localStorage.getItem('page'))
//     {
//       this.initialPrevPage=1;
//     }else{
//       if(this.type=='githubs'){
//         this.currentPage = 1;
//       }else {
//         this.currentPage = 0;
//       }
//     }
//     this.repo
//       .getCommit(this.type, this.repoId, this.repoUrl, branchName, this.currentPage , this.limit)
//       .subscribe(async (res: any) => {
//         this.commitsPerCall = res;
//         for (let link of res._metadata.links) {
//           if (link.next) {
//             this.next = link.next;
//           }
//           if (link.prev) {
//             this.prev = link.prev;
//           }
//         }
//         if (this.commitsPerCall.length == res._metadata.total_count) {
//           this.next = '';
//         }
//         this.isLoading.commit = false;
//         this.commit = res.data;
//         this.commitList = [
//           {
//             branch: branchName,
//             commits: this.commit,
//           },
//         ];
//         let selfUrl;
//         for (let i = 0; i < res._metadata.links.length; i++) {
//           if (res._metadata.links[i].self) {
//             selfUrl = res._metadata.links[i].self;
//           }
//         }
//         var numb = selfUrl.match(/\d/g);
//         await this.navigateRoute.navigate([], {
//           queryParams: { page: this.currentPage, limit: this.limit, branch: branchName },
//           queryParamsHandling: 'merge',
//         });
//         if (this.commitId) {
//           this.getProcess(this.commitId,this.currentPage);
//         } else {
//           this.getProcess(this.commit[0].sha,this.currentPage);
//         }
//       });
//   }
//
//   getPrevNextCommit(branchName: any, pageNumber: number) {
//
//     this.currentPage=pageNumber;
//     this.c_page=pageNumber;
//     localStorage.setItem('page', String(pageNumber));
//     this.repo
//       .getPrevNextCommit(
//         this.type,
//         this.repoId,
//         this.repoUrl,
//         branchName,
//         pageNumber,
//         this.limit
//       )
//       .subscribe((res: any) => {
//         if(pageNumber==1){
//           this.initialPrevPage=0;
//         }else {
//           this.initialPrevPage=1;
//         }
//         this.commit = res.data;
//         this.commitList = [
//           {
//             branch: branchName,
//             commits: this.commit,
//           },
//         ];
//         if (res.data) {
//           this.isLoading.commit = false;
//           this.isLoading.commit = false;
//           this.commit = res.data;
//           for (let link of res._metadata.links) {
//             if (link.next) {
//               this.next = link.next;
//             }
//             if (link.prev) {
//               this.prev = link.prev;
//             }
//           }
//           if (this.commitsPerCall.length == res._metadata.total_count) {
//             this.next = '';
//           }
//           this.navigateRoute.navigate([], {
//             queryParams: { page: pageNumber, limit: this.limit, branch: branchName },
//             queryParamsHandling: 'merge',
//           });
//         }
//       });
//   }
//
//   getPrevCommit(){
//
//   }
//   getNextCommit(){
//   }
//
//   getProcess(commitId: any,page:any) {
//     // @ts-ignore
//     let pageNumber = parseInt(localStorage.getItem('page'));
//
//     // @ts-ignore
//     this.isLoading.graph = true;
//     let newBranch:string='';
//     this.repo.getProcess(commitId).subscribe((res: any) => {
//
//       this.processIds = [];
//       if (res.data == null) {
//         this.error.pipeline = 'error';
//         this.envList = '';
//         this.pipeline = '';
//         this.isLoading.graph = false;
//         this.navigateRoute
//           .navigate([], {
//             queryParams: { processID: null },
//             queryParamsHandling: 'merge',
//           })
//           .then((r) => {});
//       } else {
//         if (res.data) {
//           for (let branch in this.branchs) {
//             for (let data of res?.data) {
//               if (data.branch === this.branchs[branch].name) {
//                 newBranch=data.branch;
//                 this.setOpenBranch(parseInt(branch));
//                 this.loadCommit(data.branch,0);
//               }
//             }
//           }
//           this.error.pipeline = '';
//           this.processIds = res.data;
//           this.getPipeline(this.processIds[0].process_id);
//           this.navigateRoute
//             .navigate([], {
//               queryParams: { processID: this.processIds[0].process_id, branch: newBranch, page:pageNumber},
//               queryParamsHandling: 'merge',
//             })
//             .then((r) => {});
//         }
//       }
//     });
//   }
//
//   getPipeline(processId: any) {
//     this.repo.getPipeLine(processId).subscribe((res: any) => {
//       if (res.data == null) {
//         this.tostr.warning(`No commit Found For this BRANCH`, 'Commits Empty', {
//           enableHtml: true,
//           positionClass: 'toast-top-center',
//           tapToDismiss: false,
//         });
//       } else {
//         this.isLoading.graph = false;
//         setTimeout(() => {
//           this.pipelineStep = res.data.steps;
//           this.pipeline = res;
//           this.envList = this.allenv();
//           this.stepsLists = this.stepsDetails();
//           this.initSvgArrow();
//           this.drawLines();
//         });
//       }
//     });
//   }
//
//   initSvgArrow() {
//     const svgHeight =
//       this.higestNodeEnv(this.nodeByEnv())[0].steps.length * 300;
//     const svgWidth = this.totalenv() * 300;
//
//     // @ts-ignore
//     document.getElementById('svg')?.style.height = svgHeight + 'px';
//     // @ts-ignore
//     document.getElementById('svg')?.style.width = svgWidth + 'px';
//   }
//
//   loadCommit(branchName: string,click:number) {
//     if(click==1){
//       localStorage.removeItem('page');
//       this.initialPrevPage=0;
//     }
//     if(localStorage.getItem('page'))
//     {
//       this.currentPage=this.currentPage;
//     }else{
//       if(this.type=='githubs'){
//         this.currentPage = 1;
//       }else {
//         this.currentPage = 0;
//       }
//     }
//
//     this.navigateRoute.navigate([], {
//       queryParams: { page: this.currentPage, limit: this.limit, branch: branchName },
//       queryParamsHandling: 'merge',
//     });
//
//     const findLogByBranchName = this.commitList.find(
//       (list) => list.branch === branchName
//     );
//     if (!findLogByBranchName) {
//       this.repo
//         .getCommit(this.type, this.repoId, this.repoUrl, branchName, this.currentPage , this.limit)
//         .subscribe((res: any) => {
//           if(click==1){
//             this.initialPrevPage=0;
//           }else{
//             this.initialPrevPage=1;
//           }
//           // this.commitList.push({
//           //   branch: branchName,
//           //   commits: [...res.data],
//           // });
//           this.commitList = [
//             {
//               branch: branchName,
//               commits: res.data,
//             },
//           ];
//         });
//     } else {
//       this.repo
//         .getCommit(this.type, this.repoId, this.repoUrl, branchName, this.currentPage , this.limit)
//         .subscribe((res: any) => {
//           Object.assign(
//             this.commitList[
//               this.commitList.findIndex((el) => el.branch === branchName)
//               ],
//             res.data
//           );
//         });
//     }
//
//   }
//
//   sleep(milliseconds: number) {
//     const date = Date.now();
//     let currentDate = null;
//     do {
//       currentDate = Date.now();
//     } while (currentDate - date < milliseconds);
//   }
//
//   timeFunc(){
//     setTimeout(()=>{
//       this.scrollLogContainerToBottom();
//       // @ts-ignore
//       // this.liveLogs.push('Log is coming! - '+this.name_count)
//       // this.name_count++;
//       this.timeFunc();
//     },1000)
//   }
//
//   getExistedLogs(
//     processId: string,
//     nodeName: string,
//     footmarkName: string,
//     page: number,
//     limit: number,
//     skip: number,
//     claim: number
//   ) {
//
//     this.repo
//       .getFootmarkLog(processId, nodeName, footmarkName, page, limit, claim)
//       .subscribe((res: any) => {
//
//         let page=0;
//         if (res?.data !== null) {
//           const footmarkData = [];
//           for (let i = this.skip; i < res?.data.length; i++) {
//             footmarkData.push(res?.data[i]);
//           }
//
//
//           //   if (res?.data.length < limit) {
//           //     this.skip = res?.data.length;
//           //   } else {
//           //     this.skip = 0;
//           //   }
//           //
//           this.logs.push({
//             name: footmarkName,
//             data: [...footmarkData],
//           });
//           //
//           // } else if (res?.data === null) {
//           //   this.page -= 1;
//           // }
//           //
//           // if (this.skip == 0) {
//           //   this.page++;
//         }
//         for(let link of res._metadata.links){
//           console.log(page,"Link",link.next)
//           setTimeout(() => {
//             if (link.next) {
//               this.getExistedLogs(
//                 processId,
//                 nodeName,
//                 footmarkName,
//                 page,
//                 this.limit,
//                 this.skip,
//                 claim
//               );
//               // this.timeFunc()
//               // this.scrollLogContainerToBottom()
//             }
//           }, 1500);
//           page++;
//         }
//
//       });
//   }
//
//   getLogs(
//     processId: string,
//     nodeName: string,
//     footmarkName: string,
//     page: number,
//     limit: number,
//     skip: number,
//     claim: number
//   ) {
//     const intObj: any = document.getElementById('intObj' + footmarkName);
//
//     const observer = new IntersectionObserver(
//       (entry: any) => {
//         this.isObjerving = !!entry[0].isIntersecting;
//       },
//       {
//         root: document.getElementById('scrollArea' + footmarkName),
//         rootMargin: '10px',
//         threshold: 1,
//       }
//     );
//     observer?.observe(intObj);
//
//     this.repo
//       .getFootmarkLog(processId, nodeName, footmarkName, page, limit, claim)
//       .subscribe((res: any) => {
//         console.log("footLog",res)
//         if (res?.data !== null) {
//           const footmarkData = [];
//           for (let i = this.skip; i < res?.data.length; i++) {
//             footmarkData.push(res?.data[i]);
//           }
//
//           if (res?.data.length < limit) {
//             this.skip = res?.data.length;
//           } else {
//             this.skip = 0;
//           }
//
//           this.logs.push({
//             name: footmarkName,
//             data: [...footmarkData],
//           });
//
//         } else if (res?.data === null) {
//           this.page -= 1;
//         }
//
//         if (this.skip == 0) {
//           this.page++;
//         }
//         setTimeout(() => {
//           if (this.isObjerving) {
//             this.getLogs(
//               processId,
//               nodeName,
//               footmarkName,
//               this.page,
//               this.limit,
//               this.skip,
//               claim
//             );
//             // this.timeFunc()
//             // this.scrollLogContainerToBottom()
//           }
//         }, 1500);
//       });
//   }
//
//   fullMode(footMarkIndex: any, foot: any) {
//     this.fullmode = true;
//     // @ts-ignore
//     document.getElementById('scrollArea' + foot)?.classList.add('logPanel');
//     this.singleLogDetails = {
//       index: footMarkIndex,
//       footmark: foot,
//     };
//   }
//
//   fullModeClose() {
//     this.fullmode = false;
//     // @ts-ignore
//     document.getElementById('scrollArea' + foot)?.classList.remove('logPanel');
//   }
//
//   private totalenv() {
//     return this.allenv().length;
//   }
//
//   private allenv() {
//     const envlist: string | string[] = [];
//     for (let step of this.pipelineStep) {
//       if (!envlist.includes(step.params.env)) {
//         envlist.push(step.params.env);
//       }
//     }
//     return envlist;
//   }
//
//   private nodeByEnv() {
//     const envs = this.allenv();
//     let nodList: string[] = [];
//     const nodeObjByenv: any = [];
//     for (let env of envs) {
//       for (let step of this.pipelineStep) {
//         if (step.params.env === env && !nodList.includes(step.name)) {
//           nodList.push(step.name);
//         }
//       }
//       nodeObjByenv.push({
//         name: env,
//         steps: nodList,
//       });
//       nodList = [];
//     }
//     return nodeObjByenv;
//   }
//
//   protected hexToBase64(str: any) {
//     return btoa(
//       String.fromCharCode.apply(
//         null,
//         str
//           .replace(/\r|\n/g, '')
//           .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
//           .replace(/ +$/, '')
//           .split(' ')
//       )
//     );
//   }
//
//   private stepsDetails() {
//     const envs = this.allenv();
//     let nodList: string[] = [];
//     let stepsDetails: any[] = [];
//     let steps: any[] = [];
//     for (let env of envs) {
//       for (let step of this.pipelineStep) {
//         if (step.params.env === env && !nodList.includes(step.name)) {
//           nodList.push(step.name);
//           steps.push({
//             name: step.name,
//             params: step.params,
//             status: step.status,
//             type: step.type,
//             claim: step.claim,
//           });
//
//         }
//       }
//       stepsDetails.push({
//         envName: env,
//         steps: steps,
//       });
//       nodList = [];
//       steps = [];
//     }
//     return stepsDetails;
//   }
//
//   private higestNodeEnv(nodeObjByenv: any) {
//     var longest = 0;
//     var longestEnv: any = [];
//
//     for (let env of nodeObjByenv) {
//       if (env.steps.length > longest) {
//         longestEnv = [env];
//         longest = env.steps.length;
//       } else if (env.steps.length == longest) {
//         longestEnv.push(nodeObjByenv);
//       }
//     }
//     return longestEnv;
//   }
//
//   public getOffset(el: any) {
//     const rect: any = el.getBoundingClientRect();
//     return {
//       x: rect.left + window.scrollX,
//       y: rect.top + window.scrollY,
//     };
//   }
//
//   private drawLines() {
//     setTimeout(() => {
//       const svg: any = document.getElementById('svg');
//       const svgOfset = this.getOffset(svg);
//
//       for (let step of this.pipelineStep) {
//         if (step.status === 'active') {
//           this.logOpen = true;
//           const processId = this.pipeline.data.process_id;
//           // this.stepFootMark(processId, step.name,step.claim);
//
//           setTimeout(() => {
//             this.pipeline.data.steps.find((pipeStep: any) => {
//               if (pipeStep.name === step.name) {
//                 this.nodeDetails = pipeStep;
//               }
//             });
//           }, 300);
//           const activeClass: any = document.getElementById(
//             step.name + '_loader'
//           );
//           activeClass.classList.add('active');
//         } else {
//           const activeClass: any = document.getElementById(
//             step.name + '_loader'
//           );
//           activeClass.classList.remove('active');
//         }
//         if (step.next !== null) {
//           for (let next of step.next) {
//             const start = this.getOffset(document.getElementById(step.name));
//             const end = this.getOffset(document.getElementById(next));
//
//             const line = document.createElementNS(
//               'http://www.w3.org/2000/svg',
//               'line'
//             );
//             line.setAttribute('x1', String(start.x - svgOfset.x + 30));
//             line.setAttribute('y1', String(start.y - svgOfset.y + 30));
//             line.setAttribute('x2', String(end.x - svgOfset.x + 30));
//             line.setAttribute('y2', String(end.y - svgOfset.y + 30));
//             line.setAttribute('id', step.name + '-' + next);
//             if (step.status === 'completed') {
//               line.setAttribute('stroke', '#36C678');
//               line.setAttribute('marker-end', 'url(#trianglesuccess)');
//             } else {
//               line.setAttribute('stroke', 'gray');
//               line.setAttribute('marker-end', 'url(#trianglegray)');
//             }
//             line.setAttribute('stroke-width', '4px');
//
//             if (svg.appendChild(line)) {
//             }
//           }
//         }
//       }
//     });
//   }
//
//   openLogPanel(stepName: any, claim:number) {
//     // console.log("LogOpenClaim:",claim);
//     this.isLogLoading=true;
//     this.logOpen = true;
//
//     const processId = this.pipeline.data.process_id;
//     // this.getPipeline(processId);
//     this.stepFootMark(processId, stepName, claim);
//     setTimeout(() => {
//       this.pipeline.data.steps.find((pipeStep: any) => {
//         if (pipeStep.name === stepName) {
//           this.nodeDetails = pipeStep;
//           this.openFootMarkName = this.footMarks[this.footMarks?.length - 1];
//           // console.log("Foot",this.footMarks,'------FootName',this.openFootMarkName)
//           this.logClaim = pipeStep.claim;
//           this.getLogs(
//             processId,
//             stepName,
//             this.openFootMarkName,
//             this.page,
//             this.limit,
//             this.skip,
//             claim
//           );
//         }
//       });
//     }, 300);
//   }
//
//
//   showLogs(stepName: any, claim:number) {
//     this.isLogLoading=false;
//     console.log(stepName,claim)
//     this.logOpen = true;
//     const processId = this.pipeline.data.process_id;
//     this.footMarkList(processId, stepName, claim);
//     setTimeout(() => {
//       this.pipeline.data.steps.find((pipeStep: any) => {
//         if (pipeStep.name === stepName) {
//           this.nodeDetails = pipeStep;
//           this.openFootMarkName = this.footMarks[this.footMarks?.length - 1];
//           console.log(pipeStep.claim,'===',claim)
//           this.logClaim = pipeStep.claim;
//           this.getExistedLogs(
//             processId,
//             stepName,
//             this.openFootMarkName,
//             this.page,
//             this.limit,
//             this.skip,
//             claim
//           );
//         }
//       });
//     }, 300);
//   }
//
//
//
//   scrollLogContainerToBottom(): void {
//     try {
//       for(let i=0; i<this.pipelineLogViewContainer._results.length; i++) {
//         this.pipelineLogViewContainer._results[i].nativeElement.scrollTop = this.pipelineLogViewContainer._results[i].nativeElement.scrollHeight;
//         this.cdref.markForCheck();
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }
//
//   trigger(step: any) {
//     const processId = this.pipeline.data.process_id;
//     this.processLifecycleEventService
//       .reclaim(processId, step.name, step.type)
//       .subscribe((res: any) => {
//         const processId = this.pipeline.data.process_id;
//         // this.getPipeline(processId);
//         this.openLogPanel(step.name,step.claim)
//       });
//   }
//
//   footMarkList(processId: any, stepName: any, claim:number){
//     this.repo
//       .getfootPrint(processId, stepName, claim)
//       .subscribe((footMarkRes: any) => {
//         console.log("footMarkRes", footMarkRes.data);
//         this.stepStatus = footMarkRes.status;
//         this.footMarks = footMarkRes.data;
//         this.activeStep = stepName;
//         this.setActiveFootMark(this.footMarks?.length - 1);
//       });
//   }
//
//   stepFootMark(processId: any, stepName: any, claim:number) {
//     this.repo
//       .getfootPrint(processId, stepName, claim)
//       .subscribe((footMarkRes: any) => {
//         console.log("footMarkRes",footMarkRes.data);
//         this.stepStatus = footMarkRes.status;
//         this.footMarks = footMarkRes.data;
//         this.activeStep = stepName;
//         this.setActiveFootMark(this.footMarks?.length - 1);
//
//         this.wsService.wsData.subscribe((WSRes) => {
//           const socketRes: any = WSRes;
//           console.log("Socket Response------:",socketRes,'-----pipelinedata-----',this.pipeline.data);
//           if (socketRes.process_id == this.pipeline.data.process_id) {
//             if (
//               this.stepStatus !== 'active' &&
//               this.openFootMark !== this.footMarks?.indexOf(socketRes?.footmark)
//             ) {
//               this.activeStep = socketRes.footmark;
//               this.setActiveFootMark(
//                 this.footMarks?.indexOf(socketRes?.footmark)
//               );
//             }
//             if (this.stepStatus === 'active') {
//             }
//           }
//         });
//
//
//         this.wsService.wsData.subscribe((res) => {
//           // console.log("WS response:",res)
//           // @ts-ignore
//           console.log("openFootMarkName---",res.footmark,'==',this.openFootMarkName);
//           // @ts-ignore
//           if (res.footmark === this.openFootMarkName  || res.footmark == 'git_clone' || res.footmark == 'build_and_push_0' || res.footmark == 'build_and_push_1' || res.footmark == 'post_build_job') {
//             console.log("Trig")
//             let found = 0;
//             for (let x of this.footMarks) {
//               // @ts-ignore
//               if (x === res.footmark) {
//                 found = 1;
//               }
//             }
//
//             if (found === 0) {
//               this.openFootMarkName = this.footMarks[this.footMarks?.length - 1];
//               // @ts-ignore
//               this.footMarks.push(res.footmark);
//               console.log("Foot---3",this.footMarks,'------FootName',this.openFootMarkName)
//             }
//           }
//         });
//       });
//   }
//
//   logClose() {
//     this.logOpen = false;
//     this.fullmode = false;
//     this.activeStep = '';
//   }
//
//   loadInfo(stepName: string) {
//     this.pipelineStep.filter(function (data: any) {
//       return data.name == stepName;
//     });
//   }
//
//   expandLog(
//     footMarkIndex: number,
//     foot: any,
//     nodeName: string,
//     claim: number,
//     status: string
//   ) {
//     console.log("ddd",claim)
//     this.singleLogDetails = {
//       index: footMarkIndex,
//       footmark: foot,
//     };
//
//     this.setActiveFootMark(footMarkIndex);
//     if (status === 'active' && this.openFootMark === footMarkIndex) {
//       // @ts-ignore
//       document.getElementById('scrollArea' + foot)?.classList.add('logPanel');
//     }
//     this.page = 0;
//     this.skip = 0;
//     this.logs = [];
//     const processId = this.pipeline.data.process_id;
//     this.getExistedLogs(
//       processId,
//       nodeName,
//       foot,
//       this.page,
//       this.limit,
//       this.skip,
//       claim
//     );
//   }
//
//   navigateToCommit(commit_Id: any) {
//     this.repo.getProcess(commit_Id).subscribe((res: any) => {
//       if (res.data !== null) {
//         this.applist
//           .getRepositoryInfo(res.data[0].company_id, res.data[0].repository_id)
//           .subscribe((appRes) => {
//             for (let x of appRes.data.applications) {
//               if (x._metadata.id === res.data[0].app_id) {
//                 const gitUrl = btoa(x.url);
//                 const title = x._metadata.name;
//                 const commitId = commit_Id;
//                 const type = appRes.data.type;
//                 const repoId = res.data[0].repository_id;
//                 const appId = res.data[0].process_id;
//                 this.navigateRoute
//                   .navigateByUrl('/RefreshComponent', {
//                     skipLocationChange: true,
//                   })
//                   .then(() => {
//                     this.navigateRoute
//                       .navigate(['repository', repoId, 'application'], {
//                         queryParams: {
//                           type: type,
//                           title: title,
//                           url: gitUrl,
//                           repoId: repoId,
//                           appId: appId,
//                           commitId: commitId,
//                         },
//                       })
//                       .then(() => {});
//                   });
//               }
//             }
//           });
//       } else {
//         this.getProcess(commit_Id,this.currentPage);
//       }
//     });
//   }
// }


//   <p class="text-sub-title pt-6 pb-3">Foot Mark</p>
// <div class="h-[calc(100vh-320px)] overflow-y-auto " id="footmarkDiv">
// <div *ngFor="let foot of footMarks; let i = index;let last = last" class=" ">
//   <mat-accordion class="example-headers-align">
// <mat-expansion-panel [expanded]="openFootMark === i"
// (opened)="expandLog(i,foot,nodeDetails.name, logClaim,nodeDetails.status)"
// hideToggle
// *ngIf="!isLoading.commit"
// class="bg-light-400"
//   >
//   <mat-expansion-panel-header class="flex justify-between"
//   >
//   <mat-panel-title class="flex gap-2 text-md">
//   {{ foot }}
// </mat-panel-title>
// <!--                <mat-icon  class="text-danger">close</mat-icon>-->
//   </mat-expansion-panel-header>
// <!--              <h1 class="bg-dark text-light p-10">this is body</h1>-->
// <!--log panel start-->
// <div class=" h-80 bg-dark flex flex-col relative">
// <div class="h-8 bg-primary-800 flex justify-end items-center px-2">
//   <mat-icon class="text-white cursor-pointer" (click)="fullMode(i,foot)">
//   fullscreen
//   </mat-icon>
//   </div>
//
//   <!--logPanel-->
//
//   <div class="px-3 pt-3 overflow-auto h-full w-full">
// <div class="h-full">
// <span *ngFor="let logDetails of logs">
//   <div #pipelineLogViewContainer class="log-container " id="scrollDiv">
// <!--                      <span *ngIf="logDetails.name === foot" class="space-y-2">-->
// <!--                        <pre-->
// <!--                          *ngFor="let log of logDetails.data"-->
// <!--                          class=" text-white text-sm break-words flex"-->
//   <!--                        >{{ log }}</pre>-->
// <!--                      </span>-->
// <pre *ngFor="let log of logDetails.data" [innerHTML]="log"></pre>
// <pre *ngIf="isLogLoading && logDetails?.data?.length === 0">Fetching Logs ...</pre>
// <span *ngIf="isLogLoading" class="terminal-spinner"></span>
//   </div>
//   </span>
//   </div>
//   <div class="my-3 h-5" id="{{'intObj'+foot}}"></div>
//   </div>
//
//
// <!--                New Log Panel-->
// <!--                -->
// <!--                <div class="flex justify-center">-->
// <!--                  <div #pipelineLogViewContainer class="overflow-y-scroll h-[288px] scroll-smooth w-full text-center">-->
// <!--                    <div class="px-3  h-full w-full" id="{{'scrollArea'+foot}}">-->
// <!--                      <div class="h-full">-->
// <!--                       <span *ngFor="let logDetails of logs">-->
// <!--                      <span *ngIf="logDetails.name === foot" class="space-y-2">-->
// <!--                        <pre-->
// <!--                          *ngFor="let log of logDetails.data"-->
// <!--                          class=" text-white text-sm break-words flex"-->
// <!--                          [innerHTML]="log"-->
// <!--                        >{{ log }}</pre>-->
// <!--                      </span>-->
// <!--                     </span>-->
// <!--                      </div>-->
// <!--                      <div class="my-3 h-5" id="{{'intObj'+foot}}"></div>-->
// <!--                    </div>-->
// <!--                      <div *ngFor="let item of liveLogs">-->
// <!--                        <p class="py-3 text-light">{{item}}</p>-->
// <!--                      </div>-->
// <!--                      <pre *ngFor="let log of liveLogs" [innerHTML]="log">{{log}}</pre>-->
// <!--                    <span  class="terminal-spinner pb-16 pl-5"></span>-->
// <!--                  </div>-->
// <!--                </div>-->
//
// </div>
//
// <!--log panel end-->
// </mat-expansion-panel>
// </mat-accordion>
// </div>
//
// </div>
