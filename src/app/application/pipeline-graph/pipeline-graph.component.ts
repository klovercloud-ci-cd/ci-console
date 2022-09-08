import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectorRef,
  Component, ElementRef,
  Input, OnDestroy,
  OnInit, ViewChild, ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { ApplicationListComponent } from '../application-list/application-list.component';
import { ToolbarService } from '../../shared/services/toolbar.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from '../../shared/services/user-data.service';
import { AuthService } from '../../auth/auth.service';
import { AppListService } from '../app-list.service';
import { RepoServiceService } from '../../repository/repo-service.service';
import { PipelineService } from '../pipeline.service';
import { WsService } from '../../shared/services/ws.service';
import { ToastrService } from 'ngx-toastr';
import { ProcessLifecycleEventService } from '../process-lifecycle-event.service';
import { FormControl, FormGroup } from '@angular/forms';
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'kcci-pipeline-graph',
  templateUrl: './pipeline-graph.component.html',
  styleUrls: ['./pipeline-graph.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PipelineGraphComponent
  implements OnInit, AfterContentChecked, AfterContentInit, OnDestroy
{

  @ViewChildren('pipelineLogViewContainer') pipelineLogViewContainer: any;
  openBranch = 0;
  openFootMark = 0;

  public singleLogDetails: { footmark: any; index: number } = {
    footmark: '',
    index: 0,
  };
  openFootMarkName: any;
  stepStatus: any;
  socketres: any;
  next: any;
  prev: any;
  self: any;
  title: any;
  initialPrevPage:number = 0;
  liveLogs = [];
  failed: any[] = [];
  error: any = {
    pipeline: '',
  };
  commitId: any;
  logClaim: any;
  scrollTimeout: any;
  scrollTimeoutCount: string = '';
  liveLogTimeoutId: any;
  dummyTimeoutId: any;
  dummyTimeoutId2: any;
  logClicked: number=0;
  openLiveLogPanel: boolean = false;
  openOldLogPanel: boolean = false;
  commit_SHA: string='';
  initialCommitData: string='';
  commitUserName: string='';
  commitUserEmail: string='';
  commitUrl: string='';
  selectedIndex: number | undefined;
  appId:string='';
  processLoading: boolean = false;
  activeRoute: string = '';
  noStepLog: string = '';
  noStepsFound!: boolean;
  wsSubscription!: Subscription;
  commitLoading !: boolean;
  currentProcessId: any;

  setOpenBranch(index: number) {
    this.openBranch = index;
  }

  setActiveFootMark(index: number) {
    this.openFootMark = index;
  }

  nextStep() {
    this.openBranch++;
  }

  prevStep() {
    this.openBranch--;
  }

  currentPage: number = 0;
  name_count: number = 1;
  c_page:any;
  commitsPerCall: any;
  newLogs: any[] = [];
  branchName: any;
  newBranchName: any;
  pipeline: any;
  pipelineStep: any;
  envList: any;
  stepsLists: any;
  logOpen: boolean = false;
  isLogLoading:boolean = false;
  fullmode = false;
  public branchs: any = [];
  public footMarks: any[] = [];
  public commitList: any[] = [];
  urlParams: any;
  repoId = this.route.snapshot.paramMap.get('repoID');
  userInfo = this.auth.getUserData();
  companyId = this.userInfo.metadata.company_id;
  type: any;
  repoUrl: any;
  sendWS: any;

  content: any = ApplicationListComponent;
  public allFootMarks: any[] = [];
  public processIds: any[] = [];
  public footMarksLegth: number = 0;
  logs: any[] = [];
  allLogsArray: any[] = [];
  prevStepName: string = '';
  page: number = 1;
  limit: any = 5;
  skip: number = 0;
  prev_logs_size: number = 0;
  nodeDetails: any = '';
  activeStep: any = '';
  init = false;
  commit: any;
  isLoading = { graph: true, commit: true };
  socket: any;
  isObjerving: boolean = false;

  // dummy
  counter = 0;

  constructor(
    private _toolbarService: ToolbarService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private usersInfo: UserDataService,
    private auth: AuthService,
    private applist: AppListService,
    private repo: RepoServiceService,
    private cdref: ChangeDetectorRef,
    private pipes: PipelineService,
    private navigateRoute: Router,
    private wsService: WsService,
    private tostr: ToastrService,
    private snack: SharedSnackbarService,
    private processLifecycleEventService: ProcessLifecycleEventService
  ) {

    // this.route.queryParams.subscribe((res) => {
    //   this.title = res['title'];
    // });

    this._toolbarService.changeData({ title: this.title });
    this.route.queryParams.subscribe((res) => {
      this.title = res['title'];
      this.type = res['type'].toLowerCase() + 's';
      this.repoUrl = atob(res['url']);
      this.commitId = res['commitId'];
      this.appId = res['appId'];
      this.newBranchName = res['branch'];
      // @ts-ignore
      if(localStorage.getItem('page')){
        // @ts-ignore
        this.currentPage = parseInt(localStorage.getItem('page'));
      }
      // // @ts-ignore
      // this.currentPage= parseInt(localStorage.getItem('page'));
      if (res['page']) {
        this.currentPage = Number(res['page']);
      }
      if (res['limit']) {
        this.limit = res['limit'];
      }
    });

    const footmarks = this.pipes.getFootMarksCredentials();
    this.footMarks = footmarks.stepName;
  }

  ngAfterContentInit(): void {
    this.wsService.wsData.subscribe((res) => {
      this.socketres = res;
      const socketRes: any = res;
      if (socketRes.process_id == this.pipeline?.data?.process_id) {
        if (socketRes.status === 'INITIALIZING') {
          this.init = true;
          if(socketRes.process_id){
          this.pipes
            .getStepDetails(socketRes.step, socketRes.process_id)
            .subscribe((res: any) => {
              if (
                res?.data.status === 'active' ||
                res?.data.status === 'queued'
              ) {
                this.getPipeline(socketRes.process_id);
                this.openLogPanel(socketRes.step, socketRes.claim);
                setTimeout(() => {
                  this.setActiveFootMark(0);
                }, 1000);
              }
            });
          }
        }
        if (socketRes.status === 'PROCESSING') {
          let faild = false;
          for (let step of this.failed) {
            if (step.name === socketRes.step) {
              faild = true;
            }
          }
          if (!this.init && !faild) {
            this.init = true;
            if(socketRes.process_id){
            this.pipes
              .getStepDetails(socketRes.step, socketRes.process_id)
              .subscribe((res: any) => {
                if (res?.data.status === 'active') {
                  this.getPipeline(socketRes.process_id);
                  this.openLogPanel(socketRes.step, socketRes.claim);
                }
              });
            }
          }
        }
        if (socketRes.status === 'FAILED' || socketRes.status === 'failed') {
          if(socketRes.process_id){
          this.pipes
            .getStepDetails(socketRes.step, socketRes.process_id)
            .subscribe((res: any) => {
              if (res?.data.status === 'failed') {
                this.getPipeline(socketRes.process_id);
              }
            });
          }
        }
        if (socketRes.status === 'SUCCESSFUL') {
          this.init = false;
          this.getPipeline(socketRes.process_id);
        }
      }
    });
  }

  @Input() nodeName!: number | string;

  ngOnDestroy() {
    if (this.sendWS) {
      clearInterval(this.sendWS);
    }
    // localStorage.removeItem('page');
  }

  ngOnInit() {
    this.scrollTimeout=this.autoScrollFunction();
    this.error.pipeline = '';
    this.getBranches();
  }

  getBranches(){
    this.isLoading.graph = true;
    this.scrollTimeout=this.autoScrollFunction();
    this.error.pipeline = '';
    this.pipes
      .getBranch(this.type, this.repoId, this.repoUrl)
      .subscribe((res: any) => {
        this.branchs = res.data;
        this.branchName = this.branchs[0].name;
        this.getCommit((this.newBranchName)?this.newBranchName:this.branchs[0].name);
      });
    this.navigateRoute
      .navigate([], {
        queryParams: { page: this.currentPage, limit: this.limit },
        queryParamsHandling: 'merge',
      })
      .then((r) => {});
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getCommit(branchName: any) {
    let pageNumber:any;
    // if(this.currentPage>0)
    // {
    //   branchName=this.currentPage;
    // }else {
    //   branchName = 0;
    // }

    if(localStorage.getItem('page'))
    {
      this.initialPrevPage=1;
    }else{
      if(this.type=='githubs'){
        this.currentPage = 1;
      }else {
        this.currentPage = 0;
      }
    }
    this.repo
      .getCommit(this.type, this.repoId, this.repoUrl, branchName, this.currentPage , this.limit)
      .subscribe(async (res: any) => {
        this.commitUserName = res.data[0].commit.author.name;
        this.commitUserEmail = res.data[0].commit.author.email;
        this.commitUrl = res.data[0].html_url;
        this.commit_SHA = res.data[0].sha;
        this.selectedIndex = 0;
        // this.activeRoute = res.data[0].sha;
        // for(let commit of res.data){
        //   if(commit.sha===res.data[0].sha){
        //     this.activeRoute = res.data[0].sha;
        //   }
        // }
        this.commitsPerCall = res;
        for (let link of res._metadata.links) {
          if (link.next) {
            this.next = link.next;
          }
          if (link.prev) {
            this.prev = link.prev;
          }
        }
        if (this.commitsPerCall.length === res._metadata.total_count) {
          this.next = '';
        }
        this.isLoading.commit = false;
        this.commit = res.data;
        this.commitList = [
          {
            branch: branchName,
            commits: this.commit,
          },
        ];
        let selfUrl;
        for (let i = 0; i < res._metadata.links.length; i++) {
          if (res._metadata.links[i].self) {
            selfUrl = res._metadata.links[i].self;
          }
        }
        var numb = selfUrl.match(/\d/g);
        await this.navigateRoute.navigate([], {
          queryParams: { page: this.currentPage, limit: this.limit, branch: branchName },
          queryParamsHandling: 'merge',
        });
        if (this.commitId) {
          this.getProcess(this.commitId,this.currentPage);
        } else {
          this.getProcess(this.commit[0].sha,this.currentPage);
        }
      });
  }

  getPrevNextCommit(branchName: any, pageNumber: number) {
    this.commitLoading = true;
    this.currentPage=pageNumber;
    this.c_page=pageNumber;
    localStorage.setItem('page', String(pageNumber));
    this.repo
      .getPrevNextCommit(
        this.type,
        this.repoId,
        this.repoUrl,
        branchName,
        pageNumber,
        this.limit
      )
      .subscribe((res: any) => {
        if(pageNumber==1){
          this.initialPrevPage=0;
        }else {
          this.initialPrevPage=1;
        }
        this.commit = res.data;
        this.commitList = [
          {
            branch: branchName,
            commits: this.commit,
          },
        ];
        if (res.data) {
          this.isLoading.commit = false;
          this.isLoading.commit = false;
          this.commit = res.data;
          for (let link of res._metadata.links) {
            if (link.next) {
              this.next = link.next;
            }
            if (link.prev) {
              this.prev = link.prev;
            }
          }
          if (this.commitsPerCall.length == res._metadata.total_count) {
            this.next = '';
          }
          this.navigateRoute.navigate([], {
            queryParams: { page: pageNumber, limit: this.limit, branch: branchName },
            queryParamsHandling: 'merge',
          });
        }

        this.commitLoading = false;
      });
  }

  getProcess(commitId: any,page:any) {

    // @ts-ignore
    let savedPageNumber = parseInt(localStorage.getItem('page'));
    let query_page:number=0;
    if(savedPageNumber){
      query_page=savedPageNumber;
    }else{
      query_page=this.page;
    }
    // @ts-ignore
    this.isLoading.graph = true;
    let newBranch:string='';
    this.repo.getProcess(commitId).subscribe((res: any) => {
      this.processIds = [];
      if (res.data == null) {
        this.error.pipeline = 'error';
        this.envList = '';
        this.pipeline = '';
        this.isLoading.graph = false;
        this.navigateRoute
          .navigate([], {
            queryParams: { processID: null },
            queryParamsHandling: 'merge',
          })
          .then((r) => {});
      } else {
        if (res.data) {
          for (let branch in this.branchs) {
            for (let data of res?.data) {
              if (data.branch === this.branchs[branch].name) {
                newBranch=data.branch;
                this.setOpenBranch(parseInt(branch));
                this.loadCommit(data.branch,0);
              }
            }
          }
          this.error.pipeline = '';
          this.processIds = res?.data;
          this.activeRoute = this.processIds[0]?.commit_id;
          this.getPipeline(this.processIds[0].process_id);
          this.navigateRoute
            .navigate([], {
              queryParams: { processID: this.processIds[0].process_id, branch: newBranch, page:query_page},
              queryParamsHandling: 'merge',
            })
            .then((r) => {});
        }
      }
    });
  }

  getPipeline(processId: any) {
    this.pipes.setProcessId(processId);
    // console.log('processId cf',this.currentProcessId)
    this.currentProcessId = processId;
    // console.log('processId af',this.currentProcessId)
    this.isLoading.graph = false;
    this.noStepLog='';
    this.noStepsFound = false;
    this.repo.getPipeLine(processId).subscribe((res: any) => {
      if (res.data == null) {
        this.tostr.warning(`No commit Found For this BRANCH`, 'Commits Empty', {
          enableHtml: true,
          positionClass: 'toast-top-center',
          tapToDismiss: false,
        });
      } else {
        if(res.data.steps===null){
          this.noStepsFound = true;
          this.repo
            .getFootmarkLog(processId, '_', 'pre_process', 0, 5, 0)
            .subscribe((res: any) => {
              this.noStepLog = res.data[res.data.length-1];
            })
        }
        setTimeout(() => {
          this.pipelineStep = res?.data?.steps;
          this.pipeline = res;
          this.envList = this.allenv();
          this.stepsLists = this.stepsDetails();
          this.initSvgArrow();
          this.drawLines();
        });
      }
    });
  }

  initSvgArrow() {
    const svgHeight = this.higestNodeEnv(this.nodeByEnv())[0]?.steps?.length * 300;
    const svgWidth = this.totalenv() * 300;

    // @ts-ignore
    document.getElementById('svg')?.style.height = svgHeight + 'px';
    // @ts-ignore
    document.getElementById('svg')?.style.width = svgWidth + 'px';
  }

  loadCommit(branchName: string,click:number) {
    this.branchName = branchName;
    if(click==1){
      localStorage.removeItem('page');
      this.initialPrevPage=0;
    }
    if(localStorage.getItem('page'))
    {
      this.currentPage=this.currentPage;
    }else{
      if(this.type=='githubs'){
        this.currentPage = 1;
      }else {
        this.currentPage = 0;
      }
    }

    this.navigateRoute.navigate([], {
      queryParams: { page: this.currentPage, limit: this.limit, branch: branchName },
      queryParamsHandling: 'merge',
    });

    const findLogByBranchName = this.commitList.find(
      (list) => list.branch === branchName
    );
    if (!findLogByBranchName) {
      this.repo
        .getCommit(this.type, this.repoId, this.repoUrl, branchName, this.currentPage , this.limit)
        .subscribe((res: any) => {
          if(click==1){
            this.initialPrevPage=0;
          }else{
            this.initialPrevPage=1;
          }
          // this.commitList.push({
          //   branch: branchName,
          //   commits: [...res.data],
          // });
          this.commitList = [
            {
              branch: branchName,
              commits: res.data,
            },
          ];
        });
    } else {
      this.repo
        .getCommit(this.type, this.repoId, this.repoUrl, branchName, this.currentPage , this.limit)
        .subscribe((res: any) => {
          Object.assign(
            this.commitList[
              this.commitList.findIndex((el) => el.branch === branchName)
              ],
            res.data
          );
        });
    }
  }

  // sleep(milliseconds: number) {
  //   const date = Date.now();
  //   let currentDate = null;
  //   do {
  //     currentDate = Date.now();
  //   } while (currentDate - date < milliseconds);
  // }

  // Auto Scrolling Function

  autoScrollFunction(){
    this.scrollTimeout = setTimeout(()=>{
      this.scrollLogContainerToBottom();
      this.autoScrollFunction();
    },1000)
  }

  scrollLogContainerToBottom(): void {
    try {
      for(let i=0; i<this.pipelineLogViewContainer._results.length; i++) {
        this.pipelineLogViewContainer._results[i].nativeElement.scrollTop = this.pipelineLogViewContainer._results[i].nativeElement.scrollHeight;
        this.cdref.markForCheck();
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Old Log Showing Button Trigger Function

  showOldLogs(stepName: any, claim:number, initialCall:number) {
    this.allLogsArray=[];
    this.openLiveLogPanel = false;
    this.openOldLogPanel = true;
    this.logOpen = true;
    const processId = this.pipeline.data.process_id;
    this.repo
      .getfootPrint(processId, stepName, claim)
      .subscribe((footMarkRes: any) => {
        this.stepStatus = footMarkRes.status;
        this.footMarks = footMarkRes.data;
        this.activeStep = stepName;
        this.setActiveFootMark(this.footMarks?.length - 1);
      });
      setTimeout(() => {
        this.pipeline.data.steps.find((pipeStep: any) => {
          if (pipeStep.name === stepName) {
            // this.isLogLoading=true;
            this.nodeDetails = pipeStep;
            this.openFootMarkName = this.footMarks[this.footMarks?.length - 1];
            this.logClaim = pipeStep.claim;
            this.getOldLogs(
              processId,
              stepName,
              this.openFootMarkName,
              this.page,
              this.limit,
              this.skip,
              claim,
              initialCall,
              's1'
            );
          }else{
            // this.isLogLoading=false;
          }
        });
      }, 300);
  }

  // Expand Old Logs

  expandOldLog(
    footMarkIndex: number,
    foot: any,
    nodeName: string,
    claim: number,
    status: string
  ) {
    this.singleLogDetails = {
      index: footMarkIndex,
      footmark: foot,
    };

    this.setActiveFootMark(footMarkIndex);
    this.page = 0;
    this.skip = 0;
    this.logs = [];
    const processId = this.pipeline.data.process_id;
    this.getOldLogs(
      processId,
      nodeName,
      foot,
      this.page,
      this.limit,
      this.skip,
      claim,
      0,
      's2'
    );
  }

  // Getting Old Log

  getOldLogs(
    processId: string,
    nodeName: string,
    footmarkName: string,
    page: number,
    limit: number,
    skip: number,
    claim: number,
    initialCall:number,
    showCount: string
  ) {
    if(initialCall===1){
      this.logs=[];
    }

    this.repo
      .getFootmarkLog(processId, nodeName, footmarkName, page, limit, claim)
      .subscribe((res: any) => {
        let pageNumber = page;
        if (res?.data !== null) {
          const footmarkData = [];
          for (let i = this.skip; i < res?.data.length; i++) {
            footmarkData.push(res?.data[i]);
            this.allLogsArray.push(res?.data[i]);
          }

          this.logs.push({
            name: footmarkName,
            data: [...footmarkData],
          });
        }
        for(let link of res._metadata.links){

          setTimeout(() => {
            if (link.next) {
              this.isLogLoading=true;
              this.getOldLogs(
                processId,
                nodeName,
                footmarkName,
                pageNumber,
                this.limit,
                this.skip,
                claim,
                0,
                's3'
              );
            }else{
              this.isLogLoading=false;
            }
          }, 1500);
        }
        pageNumber++;
      });
  }

  fullMode(footMarkIndex: any, foot: any) {
    this.fullmode = true;
    // @ts-ignore
    // document.getElementById('scrollArea' + foot)?.classList.add('logPanel');
    this.singleLogDetails = {
      index: footMarkIndex,
      footmark: foot,
    };
  }

  fullModeClose() {
    this.fullmode = false;
    // @ts-ignore
    // document.getElementById('scrollArea' + foot)?.classList.remove('logPanel');
  }

  private totalenv() {
    return this.allenv().length;
  }

  private allenv() {
    let envlist: string | string[] = [];
    if (this.pipelineStep) {
    for (let step of this.pipelineStep) {
      if (!envlist.includes(step.params.env)) {
        envlist.push(step.params.env);
        }
      }
    }else{
      envlist = [];
    }
    return envlist;
  }

  private nodeByEnv() {
    const envs = this.allenv();
    let nodList : string[] = [];
    const nodeObjByenv : any = [];
    for (let env of envs) {
      for (let step of this.pipelineStep) {
        if (step.params.env === env && !nodList.includes(step.name)) {
          nodList.push(step.name);
        }
      }
      nodeObjByenv.push({
        name: env,
        steps: nodList,
      });
      nodList = [];
    }
    return nodeObjByenv;
  }

  protected hexToBase64(str: any) {
    return btoa(
      String.fromCharCode.apply(
        null,
        str
          .replace(/\r|\n/g, '')
          .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
          .replace(/ +$/, '')
          .split(' ')
      )
    );
  }

  private stepsDetails() {
    const envs = this.allenv();
    let nodList: string[] = [];
    let stepsDetails: any[] = [];
    let steps: any[] = [];
    for (let env of envs) {
      for (let step of this.pipelineStep) {
        if (step.params.env === env && !nodList.includes(step.name)) {
          nodList.push(step.name);
          steps.push({
            name: step.name,
            params: step.params,
            status: step.status,
            type: step.type,
            claim: step.claim,
          });

        }
      }
      stepsDetails.push({
        envName: env,
        steps: steps,
      });
      nodList = [];
      steps = [];
    }
    return stepsDetails;
  }

  private higestNodeEnv(nodeObjByenv: any) {
    var longest = 0;
    var longestEnv: any = [];

    for (let env of nodeObjByenv) {
      if (env.steps.length > longest) {
        longestEnv = [env];
        longest = env.steps.length;
      } else if (env.steps.length == longest) {
        longestEnv.push(nodeObjByenv);
      }
    }
    return longestEnv;
  }

  public getOffset(el: any) {
    const rect: any = el.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    };
  }

  private drawLines() {
    setTimeout(() => {
      const svg: any = document.getElementById('svg');
      const svgOfset = this.getOffset(svg);

      if (this.pipelineStep) {
      for (let step of this.pipelineStep) {
        if (step.status === 'active') {
          this.logOpen = true;
          const processId = this.pipeline.data.process_id;
          // this.stepFootMark(processId, step.name,step.claim);

          setTimeout(() => {
            this.pipeline.data.steps.find((pipeStep: any) => {
              if (pipeStep.name === step.name) {
                this.nodeDetails = pipeStep;
              }
            });
          }, 300);
          const activeClass: any = document.getElementById(
            step.name + '_loader'
          );
          activeClass.classList.add('active');
        } else {
          const activeClass: any = document.getElementById(
            step.name + '_loader'
          );
          activeClass.classList.remove('active');
        }
        if (step.next !== null) {
          for (let next of step.next) {
            const start = this.getOffset(document.getElementById(step.name));
            const end = this.getOffset(document.getElementById(next));

            const line = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'line'
            );
            line.setAttribute('x1', String(start.x - svgOfset.x + 30));
            line.setAttribute('y1', String(start.y - svgOfset.y + 30));
            line.setAttribute('x2', String(end.x - svgOfset.x + 30));
            line.setAttribute('y2', String(end.y - svgOfset.y + 30));
            line.setAttribute('id', step.name + '-' + next);
            if (step.status === 'completed') {
              line.setAttribute('stroke', '#36C678');
              line.setAttribute('marker-end', 'url(#trianglesuccess)');
            } else {
              line.setAttribute('stroke', 'gray');
              line.setAttribute('marker-end', 'url(#trianglegray)');
            }
            line.setAttribute('stroke-width', '4px');

            if (svg.appendChild(line)) {
            }
          }
        }
      }
    }
    });
  }

  // Livelogs Trigger Function

  trigger(step: any) {
    console.log("this.dummyTimeoutId",this.dummyTimeoutId)
    this.allLogsArray=[];
    this.openLiveLogPanel = true;
    this.openOldLogPanel = false;
    const processId = this.pipeline.data.process_id;
    if(processId){
    this.processLifecycleEventService
      .reclaim(processId, step.name, step.type)
      .subscribe((res: any) => {
        const processId = this.pipeline.data.process_id;
        this.openLogPanel(step.name,step.claim);
      });
    }
  }

  // LiveLog opening panel

  openLogPanel(stepName: any, claim:number) {
    this.logOpen = true;
    const processId = this.pipeline.data.process_id;
    this.stepFootMark(processId, stepName, claim);
    // if(this.dummyTimeoutId2){
    //   clearTimeout(this.dummyTimeoutId2)
    // }

      setTimeout(() => {
        this.pipeline.data.steps.find((pipeStep: any) => {
          if (pipeStep.name === stepName) {
            // this.isLogLoading=true;
            this.nodeDetails = pipeStep;
            this.openFootMarkName = this.footMarks[this.footMarks?.length - 1];
            this.logClaim = pipeStep.claim;
            this.dummyTimeoutId2 = setTimeout(()=>{
                this.getLiveLogs(
                processId,
                stepName,
                this.openFootMarkName,
                this.page,
                this.limit,
                this.skip,
                claim,
                's1'
              );
            })
          }else{
            // this.isLogLoading=false;
          }
        });
        // this.isLogLoading=false;
      }, 300);
  }

  // Footmark List

  stepFootMark(processId: any, stepName: any, claim:number) {
    this.logs = [];
    let newClaim:number=0;
    if(typeof claim === 'number'){
      newClaim=claim;
    }else{
      newClaim= parseInt(claim);
    }

    // this.isLogLoading = true;
    this.repo
      .getfootPrint(processId, stepName, newClaim)
      .subscribe((footMarkRes: any) => {
        if (footMarkRes.data.length < 2) {
        this.stepStatus = footMarkRes.status;
        this.footMarks = footMarkRes.data;
        this.pipes.setStepName(footMarkRes.data);
        this.pipes.setClaim(claim);
        this.activeStep = stepName;
        this.setActiveFootMark(this.footMarks?.length - 1);
        let temp: number = 1;
        let currentLogValue: string = '', nextLogValue: string = '', count = 0;
          if(this.wsSubscription){
            this.wsSubscription.unsubscribe();
          }
        this.wsSubscription =  this.wsService.wsData.subscribe((WSRes) => {
          const socketRes: any = WSRes;
          const footmarkData: any = [];
          this.openFootMarkName = this.footMarks[this.footMarks?.length - 1];

          if (footMarkRes.data !== null) {
            currentLogValue = socketRes.log;
            if (currentLogValue !== nextLogValue) {
              console.log('aaa')
              this.isLogLoading = true;
              footmarkData.push(currentLogValue);

              this.allLogsArray.push(currentLogValue);
              this.logs.push({
                name: this.openFootMarkName,
                data: [...footmarkData],
              });
            }else{
              console.log('aab')
              this.isLogLoading = false;
            }
            nextLogValue = currentLogValue;
            count++;
          }
          if (socketRes.process_id == this.pipeline.data.process_id) {

            if (this.stepStatus !== 'active' && this.openFootMark !== this.footMarks?.indexOf(socketRes?.footmark)) {
              this.activeStep = socketRes.footmark;
              this.openFootMarkName = this.footMarks[this.footMarks?.length - 1];
              this.setActiveFootMark(this.footMarks?.indexOf(socketRes?.footmark));
            }
          }
          let found = 0;
          for (let x of this.footMarks) {
            // @ts-ignore
            if (x === socketRes.footmark) {
              found = 1;
            }
          }

          if (found === 0 && (this.nodeDetails.name === socketRes.step)) {
            // @ts-ignore
            this.footMarks.push(socketRes.footmark);
            this.openFootMarkName = this.footMarks[this.footMarks?.length - 1];
          }
          // }
          temp++;
        });


        // this.wsService.wsData.subscribe((res) => {
        //   // @ts-ignore
        //   // || res.footmark == 'git_clone' || res.footmark == 'build_and_push_0' || res.footmark == 'build_and_push_1' || res.footmark == 'post_build_job'
        //   // @ts-ignore
        //   if (res.footmark === this.openFootMarkName) {
        //     let found = 0;
        //     for (let x of this.footMarks) {
        //       // @ts-ignore
        //       if (x === res.footmark) {
        //         found = 1;
        //       }
        //     }
        //
        //     if (found === 0) {
        //       // this.openFootMarkName = this.footMarks[this.footMarks?.length - 1];
        //       // @ts-ignore
        //       this.footMarks.push(res.footmark);
        //     }
        //   }
        // });
      }

      });
  }

  // Open Live Running Tab

  expandLog(
    footMarkIndex: number,
    foot: any,
    nodeName: string,
    claim: number,
    status: string
  ) {

    this.singleLogDetails = {
      index: footMarkIndex,
      footmark: foot,
    };

    this.setActiveFootMark(footMarkIndex);
    // if (status === 'active' && this.openFootMark === footMarkIndex) {
    //   // @ts-ignore
    //   document.getElementById('scrollArea' + foot)?.classList.add('logPanel');
    // }
    this.page = 0;
    this.skip = 0;
    this.logs = [];
    const processId = this.pipeline.data.process_id;
    // if (this.liveLogTimeoutId) {
    //   clearTimeout(this.liveLogTimeoutId);
    // }
    if(this.dummyTimeoutId){
      clearTimeout(this.dummyTimeoutId);
    }
    this.dummyTimeoutId = setTimeout(()=>{
      this.getLiveLogs(
        processId,
        nodeName,
        foot,
        this.page,
        this.limit,
        this.skip,
        claim,
        's2'
      );
    })

  }

  // Getting Live Log

  getLiveLogs(
    processId: string,
    nodeName: string,
    footmarkName: string,
    page: number,
    limit: number,
    skip: number,
    claim: number,
    showCount:string
  ) {
    this.repo
      .getFootmarkLog(processId, nodeName, footmarkName, page, limit, claim)
      .subscribe((res: any) => {
        console.log("Live Response",res);
        this.counter ++;
        let pageNumber = page;
        if (res?.data !== null) {
          console.log('aaaaa')
          this.isLogLoading=true;
          const footmarkData = [];
          for (let i = this.skip; i < res?.data.length; i++) {
            footmarkData.push(res?.data[i]);
            this.allLogsArray.push(res?.data[i]);
          }
          // if (res?.data.length < limit) {
          //   this.skip = res?.data.length;
          // } else {
          //   this.skip = 0;
          // }

          this.logs.push({
            name: footmarkName,
            data: [...footmarkData],
          });

          // } else if (res?.data === null) {
          //   this.page -= 1;
          // }
          //
          // if (this.skip == 0) {
          //   this.page++;
        }else{
          console.log('aaaaab')
          this.isLogLoading = false;
        }
        let i = 0
        for(let link of res._metadata.links){
          if (this.liveLogTimeoutId) {
            window.clearTimeout(this.liveLogTimeoutId);
          }
          this.liveLogTimeoutId = window.setTimeout(() => {
            if (link.next) {
              this.isLogLoading=true;
              this.getLiveLogs(
                processId,
                nodeName,
                footmarkName,
                pageNumber,
                this.limit,
                this.skip,
                claim,
                's3'
              );
            }else{
              this.isLogLoading=false;
            }
          }, 1500);
          pageNumber++;
        }
      });
  }

  logClose() {
    this.logOpen = false;
    this.fullmode = false;
    this.activeStep = '';
  }

  loadInfo(stepName: string) {
    this.pipelineStep?.filter(function (data: any) {
      return data.name == stepName;
    });
  }

  processTrigger(data:any){
    this.processLoading = true;
    // 'companyId': data?.companyId,
    let commitDetails:any;
    for(let item of this.commitList){
      for(let commit of item.commits){
        if(commit.sha===this.commit_SHA){
          commitDetails=commit;
        }
      }
    }

    this.usersInfo.getUserInfo(this.userInfo.user_id).subscribe((userResponse:any)=>{

      const githubUsername = (data?.repoUrl.split('github.com/')[1]).split('/')[0];
      const repositoryName = (data?.repoUrl.split(githubUsername)[1]).replace('/','');
      const payload = {
          "after": this.commit_SHA,
          "ref": `refs/heads/${this.branchName}`,
          "repository": {
            "name": repositoryName,
            "full_name": `${userResponse.data.first_name}/${repositoryName}`,
            "owner": {
              "name": userResponse.data.first_name,
              "email": this.commitUserEmail,
              "login": githubUsername,
            },
            "url": data?.repoUrl,
            "default_branch": this.branchName,
          },
          "commits": [
            {
              "id": this.commit_SHA,
              "url": this.commitUrl
            }
          ]
      }

      this.pipes
        .triggerProcess(payload,this.type,this.appId)
        .subscribe((res: any) => {
          this.navigateToCommit(commitDetails,0,'some');
          // this.ngAfterContentInit();
          // this.ngOnInit();
          this.snack.openSnackBar('Process Trigger','Successful','sb-success')
          this.processLoading = false;
        },(err)=>{
          this.snack.openSnackBar('Process Trigger Failed',err,'sb-error')
          this.processLoading = false;
        });
    })
  }

  navigateToCommit(commitInfo: any, index:number,event:any) {
    this.isLoading.graph = true;
    this.envList = [];

    this.commitUserName = commitInfo.commit.author.name;
    this.commitUserEmail = commitInfo.commit.author.email;
    this.commitUrl = commitInfo.html_url;
    const commit_Id = commitInfo.sha;
    this.commit_SHA=commit_Id;
    this.activeRoute = commitInfo.sha;
    this.repo.getProcess(commit_Id).subscribe((res: any) => {
      if (res.data !== null) {
        this.applist
          .getRepositoryInfo(res.data[0].company_id, res.data[0].repository_id)
          .subscribe((appRes) => {
            for (let x of appRes.data.applications) {
              if (x._metadata.id === res.data[0].app_id) {
                const gitUrl = btoa(x.url);
                const title = x._metadata.name;
                const commitId = commit_Id;
                const type = appRes.data.type;
                const repoId = res.data[0].repository_id;
                // const appId = res.data[0].process_id;

                this.title = title;
                this.type = type.toLowerCase() + 's';
                this.repoUrl = x.url;
                this.commitId = commitId;
                this.appId = this.appId;
                this.newBranchName = this.newBranchName;
                // this.ngAfterContentInit();
                this.getBranches();

                // this.navigateRoute
                //   .navigateByUrl('/RefreshComponent', {
                //     skipLocationChange: true,
                //   })
                //   .then(() => {
                //     this.navigateRoute
                //       .navigate(['repository', repoId, 'application'], {
                //         queryParams: {
                //           type: type,
                //           title: title,
                //           url: gitUrl,
                //           repoId: repoId,
                //           appId: this.appId,
                //           commitId: commitId,
                //         },
                //       })
                //       .then(() => {});
                //     // window.location.reload();
                //   });
              }
            }
            // this.isLoading.graph = false;
          });
      } else {
        this.getProcess(commit_Id,this.currentPage);
      }
    });
  }
}
