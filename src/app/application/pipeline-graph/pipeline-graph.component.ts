import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ApplicationListComponent } from '../application-list/application-list.component';
import { ToolbarService } from '../../shared/services/toolbar.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from '../../shared/services/user-data.service';
import { AuthService } from '../../auth/auth.service';
import { AppListService } from '../app-list.service';
import { RepoServiceService } from '../../repository/repo-service.service';
import { PipelineService } from '../pipeline.service';
import {skip} from "rxjs";
import {WsService} from "../../shared/services/ws.service";

@Component({
  selector: 'kcci-pipeline-graph',
  templateUrl: './pipeline-graph.component.html',
  styleUrls: ['./pipeline-graph.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PipelineGraphComponent
  implements OnInit, AfterContentChecked, AfterContentInit
{
  openBranch = 0;
  openFootMark = 0;

  public singleLogDetails: { footmark: any; index: number } = {
    footmark: '',
    index: 0,
  };
  openFootMarkName: any;
  stepStatus: any;
  socketres: any;


  setOpenBranch(index: number) {
    this.openBranch = index;
  }

  setActiveFootMark(index: number) {
    this.openFootMark = index
  }

  nextStep() {
    this.openBranch++;
  }

  prevStep() {
    this.openBranch--;
  }

  newLogs: any[] = [];
  branchPanelOpen: boolean | undefined;
  pipeline: any;
  pipelineStep: any;
  envList: any;
  stepsLists: any;
  logOpen: boolean = false;
  branchList: any;
  fullmode = false;
  public branchs: any = [];
  public footMarks: any[] = [];
  public commitList: any[] = [];

  urlParams: any = JSON.parse(
    atob(this.hexToBase64(this.route.snapshot.paramMap.get('appID')))
  );
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
  prevStepName: string = '';
  page: number = 1;
  limit: number = 10;
  skip: number=0;
  prev_logs_size: number = 0;
  nodeDetails: any = '';
  activeStep: any = '';

  //refactor Start
  commit: any;
  _processIds: any;
  isLoading = { graph: true, commit: true };
  socket: any;
  isObjerving: boolean = false;

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
    private wsService:WsService
  ) {
    this._toolbarService.changeData({ title: this.urlParams.title });
  }

  ngAfterContentInit(): void {
    this.wsService.wsData.subscribe(res=>{
      this.socketres = res;
      const socketRes:any = res;
      if (socketRes && socketRes.footmark) {
        if (
          (socketRes.status === 'INITIALIZING' &&
            this.activeStep != socketRes.step) ||
          (socketRes.status === 'PROCESSING' &&
            this.activeStep != socketRes.step)
        ) {
          if (socketRes.status === 'INITIALIZING') {
            localStorage.setItem('isFailed', 'false');
            this.activeStep = socketRes.step;
           setTimeout(()=>{
              this.startBuild(this.activeStep);
            },500)
          }
          if (
            socketRes.status === 'PROCESSING' &&
            localStorage.getItem('isFailed') === 'false'
          ) {
            this.activeStep = socketRes.step;
          }
        }
        if (this.activeStep === '') {
          this.activeStep = socketRes.step;
        }
        console.log(socketRes);
        if (socketRes.status === 'FAILED' || socketRes.status === 'ERROR') {
          localStorage.setItem('isFailed', 'true');
          this.repo.getPipeLine(socketRes.process_id).subscribe((res: any) => {
              this.pipelineStep = res.data.steps;
              this.pipeline = res;
              this.envList = this.allenv();
              this.stepsLists = this.stepsDetails();
              this.initSvgArrow();
              this.drawLines();
              this.logClose();
              this.startBuild(this.activeStep);
              this.activeStep = '';
          });
        }
        if (socketRes.status === 'SUCCESSFUL') {
        }
      }
    })
  }

  @Input() nodeName!: number | string;

  ngOnDestroy() {
    if (this.sendWS) {
      clearInterval(this.sendWS);
    }
  }

  ngOnInit() {
    this.type = this.urlParams.type.toLowerCase() + 's';
    this.repoUrl = this.urlParams.url;
    this.pipes
      .getBranch(this.type, this.repoId, this.repoUrl)
      .subscribe((res: any) => {
        this.branchs = res.data;
        this.getCommit(this.branchs[0].name);
      });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getCommit(branchName: any) {
    this.repo
      .getCommit(this.type, this.repoId, this.repoUrl, branchName)
      .subscribe(async (res: any) => {
        this.commit = res.data;
        console.log(this.commit);
        this.commitList.push({
          branch: branchName,

          commits: [...this.commit],
        });
        this.getProcess(this.commit[0].sha);
      });
  }

  getProcess(commitId: any) {
    this.isLoading.graph = true;
    console.log(commitId);
    this.repo.getProcess(commitId).subscribe((res: any) => {
      if (res.data) {
        this.processIds = res.data;
        console.log(this.processIds);
        this.getPipeline(this.processIds[0].process_id);
      }
    });
  }

  getPipeline(processId: any) {
    this.repo.getPipeLine(processId).subscribe((res: any) => {
      this.isLoading.graph = false;
      this.isLoading.commit = false;
      setTimeout(() => {
        this.pipelineStep = res.data.steps;
        this.pipeline = res;
        this.envList = this.allenv();
        this.stepsLists = this.stepsDetails();
        this.initSvgArrow();
        this.drawLines();
      });
    });
  }

  initSvgArrow() {
    const svgHeight =
      this.higestNodeEnv(this.nodeByEnv())[0].steps.length * 230;
    const svgWidth = this.totalenv() * 230;

    // @ts-ignore
    document.getElementById('svg')?.style.height = svgHeight + 'px';
    // @ts-ignore
    document.getElementById('svg')?.style.width = svgWidth + 'px';
  }

  loadCommit(branchName: string) {
    const findLogByBranceName = this.commitList.find(
      (list) => list.branch === branchName
    );
    if (!findLogByBranceName) {
      this.repo
        .getCommit(this.type, this.repoId, this.repoUrl, branchName)
        .subscribe((res: any) => {
          this.commitList.push({
            branch: branchName,

            commits: [...res.data],
          });
        });
    } else {
      this.repo
        .getCommit(this.type, this.repoId, this.repoUrl, branchName)
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

  sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }


  makeApiCallForLogs(
    processId: string,
    nodeName: string,
    footmarkName: string,
    page: number,
    limit: number,
    skip: number
  ) {
    this.repo
      .getFootamarkLog(processId, nodeName, footmarkName, page, limit)
      .subscribe((res: any) => {
        console.log(res.data);
        return res.data;
      });
  }

  getLogs(
    processId: string,
    nodeName: string,
    footmarkName: string,
    page: number,
    limit: number,
    skip: number
  ) {
    const intObj: any = document.getElementById('intObj' + footmarkName);

    const observer = new IntersectionObserver(
      (entry: any) => {
        if (entry[0].isIntersecting) {
          this.isObjerving =true
        }
        else{
          this.isObjerving =false
        }
      },
      {
        root: document.getElementById('scrollArea' + footmarkName),
        rootMargin: '10px',
        threshold: 1,
      }
    );
    observer.observe(intObj);

    this.repo
      .getFootamarkLog(processId, nodeName, footmarkName, page, limit)
      .subscribe((res: any) => {
        if (res?.data !== null){
          const footmarkData = []
          console.log(this.page,'page')
          console.log(this.skip,'skip')
          for (let i=this.skip; i<res?.data.length;i++){
            footmarkData.push(res?.data[i])
          }

          if (res?.data.length < limit) {
            this.skip = res?.data.length
          } else {
            this.skip = 0
          }
          console.log(footmarkData)

          this.logs.push({
            name:footmarkName,
            data:[...footmarkData]
          })


        } else if (res?.data === null) {
          this.page -= 1

        }

        if (this.skip == 0) {
          this.page++
        }
        setTimeout(()=>{
          if (this.isObjerving){
            console.log(this.page,this.skip)
            this.getLogs(processId, nodeName, footmarkName, this.page, this.limit, this.skip)
          }
        },2000)

      });
  }

  fullMode(footMarkIndex: any, foot: any) {
    this.fullmode = true;
    this.singleLogDetails = {
      index: footMarkIndex,
      footmark: foot,
    };
  }

  fullModeClose() {
    this.fullmode = false;
  }

  private totalenv() {
    return this.allenv().length;
  }

  private allenv() {
    const envlist: string | string[] = [];
    for (let step of this.pipelineStep) {
      if (!envlist.includes(step.params.env)) {
        envlist.push(step.params.env);
      }
    }
    return envlist;
  }

  private nodeByEnv() {
    const envs = this.allenv();
    let nodList: string[] = [];
    const nodeObjByenv: any = [];
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

      for (let step of this.pipelineStep) {
        if (step.next !== null) {
          const startNode = document.getElementById(step.name);
          const startNodeOfset = this.getOffset(startNode);
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
    });
  }

  startBuild(stepName: any) {
    this.logOpen = true;
    this.openFootMarkName = stepName
    const processId = this.pipeline.data.process_id;
    this.pipeline.data.steps.find((hola: any) => {
      if (hola.name === stepName) {
        this.nodeDetails = hola;
      }
    });
    this.stepFootMark(processId, stepName, this.nodeDetails.status);

  }

  stepFootMark(processId: any, stepName: any, status: any) {
    this.repo.getfootPrint(processId, stepName).subscribe((res: any) => {
      this.stepStatus =res.status
      this.footMarks = res.data
      this.setActiveFootMark(this.footMarks.length-1)

      this.wsService.wsData.subscribe(res=>{
       // @ts-ignore
        if ( res.step === this.openFootMarkName){
          let found = 0
          for (let x of this.footMarks){
            // @ts-ignore
            if (x === res.footmark){
              found = 1
            }
          }
          if (found === 0){
            // @ts-ignore
            this.footMarks.push(res.footmark)
          }
          this.setActiveFootMark(this.footMarks.length-1)
       }
      })
    })
  }

  logClose() {
    this.logOpen = false;
    this.fullmode = false;
    this.activeStep =''
  }

  loadInfo(stepName: string) {
    const info = this.pipelineStep.filter(function (data: any) {
      return data.name == stepName;
    });
  }

  getGetProcessById(commit: any, id: number): void {
    this.repo.getProcess(commit.data[0].sha).subscribe((res: any) => {
      this.processIds = res.data;
      this.repo.getPipeLine(res.data[0].process_id).subscribe((res: any) => {
        this.pipelineStep = res.data.steps;
        this.pipeline = res;
        this.envList = this.allenv();
        this.stepsLists = this.stepsDetails();
        this.initSvgArrow();
      });
    });
  }

  expandLog(footMarkIndex: number, foot: any, nodeName: string) {
    this.setActiveFootMark(footMarkIndex)
    this.page = 0;
    this.skip=0
    this.logs=[]
    const processId = this.pipeline.data.process_id;
    this.getLogs(processId, nodeName, foot, this.page, this.limit, this.skip);
  }
}
