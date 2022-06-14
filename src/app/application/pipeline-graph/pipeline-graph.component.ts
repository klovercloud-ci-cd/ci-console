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

  setOpenBranch(index: number) {
    this.openBranch = index;
  }

  setActiveFootMark(index: number) {}

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
  page: number = 0;
  limit: number = 0;
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
    private pipes: PipelineService
  ) {
    this._toolbarService.changeData({ title: this.urlParams.title });
  }

  ngAfterContentInit(): void {
    const company_Id: string = this.auth.getUserData().metadata.company_id;
    const socket = this.pipes.connectToSocket(company_Id);
    /*this.sendWS = setInterval(() => {
      socket.send(' ');
    }, 300);*/
    const data = [
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
      /*{
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
      },*/
    ];
    let i = 0;
    setInterval(() => {
      let socketRes: any;
      if (i === 0) {
        socketRes = data[0];
      } else {
        socketRes = data[Math.floor(Math.random() * 10) + 1];
      }
      let found = false;

      if (socketRes && socketRes.footmark) {
        for (let x of this.footMarks) {
          if (x == socketRes.footmark) {
            found = true;
          }
        }
      }
      if (socketRes && socketRes.footmark) {
        for (let y of this.allFootMarks) {
          if (y.stepName === socketRes.step) {
            console.log('ok');
          }
        }
      }
      if (!found) {
        // need to fix duplicate indexing for step
        if (socketRes && socketRes.footmark) {
          this.footMarks.push(socketRes.footmark);
          this.openFootMark = this.footMarks.length - 1;
        }
      }
      i++;

      ////------------------
      /* setTimeout(() => {
         this.expandLog(socketRes.footmark, socketRes.step);
       }, 300);*/
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
            this.getPipelineWithStartBuild(socketRes.process_id);
          }
          if (
            socketRes.status === 'PROCESSING' &&
            localStorage.getItem('isFailed') === 'false'
          ) {
            this.activeStep = socketRes.step;
            this.getPipelineWithStartBuild(socketRes.process_id);
          }
        }
        if (this.activeStep === '') {
          this.activeStep = socketRes.step;
        }
        console.log(socketRes);
        if (socketRes.status === 'FAILED' || socketRes.status === 'ERROR') {
          localStorage.setItem('isFailed', 'true');
          this.repo.getPipeLine(socketRes.process_id).subscribe((res: any) => {
            setTimeout(() => {
              this.pipelineStep = res.data.steps;
              this.pipeline = res;
              this.envList = this.allenv();
              this.stepsLists = this.stepsDetails();

              setTimeout(() => {
                const loadeClass = document.getElementsByClassName('loadbase');
                for (let x of loadeClass) {
                  x.classList.remove('active');
                }
                this.initSvgArrow();
                this.drawLines();
                this.logClose();
                this.startBuild(this.activeStep);

                this.activeStep = '';
              }, 500);
            });
          });
        }
        if (socketRes.status === 'SUCCESSFUL') {
        }
      }
    }, 3000);
    /*socket.onmessage = (e) => {
      if (e.data !== 'null') {
        const socketRes = JSON.parse(e.data);
        if (this.logOpen) {
          const scrollArea: any = document.getElementById(
            'scrollArea' + socketRes.footmark
          );
          if (!scrollArea.classList.contains('logPanel')) {
            scrollArea.classList.add('logPanel');
          }
        }
        if (this.activeStep === '') {
          this.activeStep = socketRes.steps;
        }
        if (
          (socketRes.status === 'INITIALIZING' &&
            this.activeStep != socketRes.step) ||
          (socketRes.status === 'PROCESSING' &&
            this.activeStep != socketRes.step)
        ) {
          if (
            socketRes.status === 'PROCESSING' &&
            localStorage.getItem('isFailed') === 'false'
          ) {
            this.activeStep = socketRes.step;
            this.getPipelineWithStartBuild(socketRes.process_id);
          }
        }
        console.log(e.data);
        if (socketRes.status === 'FAILED' || socketRes.status === 'ERROR') {
          this.repo.getPipeLine(socketRes.process_id).subscribe((res: any) => {
            setTimeout(() => {
              this.pipelineStep = res.data.steps;
              this.pipeline = res;
              this.envList = this.allenv();
              this.stepsLists = this.stepsDetails();

              setTimeout(() => {
                const loadeClass = document.getElementsByClassName('loadbase');
                for (let x of loadeClass) {
                  x.classList.remove('active');
                }
                this.initSvgArrow();
                this.drawLines();
                this.logClose();
                this.startBuild(this.activeStep);
                this.activeStep = '';
              }, 500);
            });
          });
        }
        if (socketRes.status === 'SUCCESSFUL') {
        }
      }
    };*/
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

  getPipelineWithStartBuild(processId: any) {
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
        setTimeout(() => {
          const loadeClass = document.getElementsByClassName('loadbase');
          for (let x of loadeClass) {
            x.classList.remove('active');
          }
          const activeClass: any = document.getElementById(
            this.activeStep + '_loader'
          );
          activeClass.classList.add('active');
          this.logClose();
          this.startBuild(this.activeStep);
        }, 10);
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

  getPaginatedLogs(
    processId: string,
    nodeName: string,
    footmarkName: string,
    page: number,
    limit: number,
    skip: number
  ) {
    if (this.prev_logs_size == 0) {
      this.repo
        .getFootamarkLog(processId, nodeName, footmarkName, page, limit)
        .subscribe((res: any) => {
          if (res.data !=null){
            const logs:any[] = res.data;
            this.prev_logs_size = logs?.length;
            if (this.prev_logs_size == 0) {
              console.log("going to sleep.")
              this.sleep(300);
            } else {
              this.logs.push({
                name:footmarkName,
                data:[...logs]
              });
              if (this.prev_logs_size == limit) {
                this.page = this.page + 1;
              }
            }
          }
        });
    } else if (this.prev_logs_size < limit) {
      this.sleep(300);
      this.repo
        .getFootamarkLog(processId, nodeName, footmarkName, this.page, limit)
        .subscribe((res: any) => {
          if (res.data !=null){
            const logs:any[] = res.data;

            if (this.prev_logs_size < logs?.length) {
              const findLogByfootMarkName = this.logs.find(
                (log) => log.name === footmarkName
              );
              if (findLogByfootMarkName){
                findLogByfootMarkName.data = [...logs?.slice(this.prev_logs_size, logs.length)];
              }
              else{
                this.logs.push({
                  name:footmarkName,
                  data:[...logs.slice(this.prev_logs_size, logs?.length)]
                });
              }
              if (logs.length == limit) {
                this.page = this.page + 1;
                this.prev_logs_size = 0;
              } else {
                this.prev_logs_size = logs?.length;
              }
            } else if (logs?.length == this.prev_logs_size) {
              return;
              // this.logs =[...logs.slice(this.prev_logs_size, this.logs.length)]
            }
          }

        });
    } else {
      this.page = this.page + 1;
      this.repo
        .getFootamarkLog(processId, nodeName, footmarkName, this.page, limit)
        .subscribe((res: any) => {
          if(res.data !=null){
            console.log(res.data)
            const logs: any[] = res.data;
            const findLogByfootMarkName = this.logs.find(
              (log) => log.name === footmarkName
            );
            if (findLogByfootMarkName){
              findLogByfootMarkName.data = [...logs];
            } else{
              this.logs.push({
                name:footmarkName,
                data:[...logs]
              });
            }
            this.prev_logs_size = 0;
          }
        });
    }

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
          console.log(entry[0].isIntersecting);

          if (this.prevStepName == '' || this.prevStepName != footmarkName) {
            this.prevStepName = footmarkName;
          }
          /*this.getPaginatedLogs(
            processId,
            nodeName,
            footmarkName,
            page,
            limit,
            skip
          );*/
          // this.makeApiCallForLogs(processId,nodeName,footmarkName,page,limit,skip)
        }
      },
      {
        root: document.getElementById('scrollArea' + footmarkName),
        rootMargin: '10px',
        threshold: 0.5,
      }
    );
    observer.observe(intObj);
    /*this.repo
      .getFootamarkLog(processId, nodeName, footmarkName,page,limit)
      .subscribe((res: any) => {



        const log = res.data
        console.log(log,'this is log response')
        if (log.length !== 0){
          if (skip != 0){
            for (let i=skip-1; i<=log.length;i++){
              this.newLogs.push(log[i])
            }
          }
          else {
            this.newLogs=[...log]
          }
          console.log(this.newLogs,'new logsssss , can be empty')
          const findLogByfootMarkName = this.logs.find(
            (log) => log.name === footmarkName
          );
          if (findLogByfootMarkName){
            findLogByfootMarkName.data =[...this.newLogs]
          }
          else {
            this.logs.push({
              name:footmarkName,
              data:[...this.newLogs]
            })
          }
          const observer = new IntersectionObserver(
            (entry: any) => {
              if (entry[0].isIntersecting) {
                this.isObjerving =true;
              } else {
                this.isObjerving =false;
              }
            },
            {
              root: document.getElementById('scrollArea' + footmarkName),
              rootMargin: '10px',
              threshold: .5,
            }
          );
          observer.observe(intObj);
          setTimeout(()=>{
            if (this.isObjerving){
              console.log('observing')
              let totalSkip = 10-res.data.length
              let nextPage:number=page
              if (totalSkip === 0 ){
                nextPage = page+1;
              }
              if (!log && page !=0){
                nextPage = page-1;
              }
              //console.log(processId, nodeName, footmarkName, nextPage, 10, totalSkip)
              this.getLogs(processId, nodeName, footmarkName, nextPage, 10, totalSkip)
            }
          },2000)
        }

      });*/
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
    this.logOpen = !this.logOpen;

    this.loadInfo(stepName);
    const processId = this.pipeline.data.process_id;
    this.pipeline.data.steps.find((hola: any) => {
      if (hola.name === stepName) {
        this.nodeDetails = hola;
      }
    });
    this.stepFootMark(processId, stepName, this.nodeDetails.status);

  }

  stepFootMark(processId: any, stepName: any, status: any) {
    const existFootMark = this.allFootMarks.find(
      (footMark) => footMark.stepName === stepName
    );
    if (existFootMark) {
      this.footMarks = existFootMark.footMark;
      this.footMarksLegth = this.footMarks.length;
    } else {
      this.repo.getfootPrint(processId, stepName).subscribe((res: any) => {
        console.log(res.data, 'FOOT-MARK');
        if (res.data) {
          this.allFootMarks.push({
            stepName: stepName,

            footMark: [...res.data],
          });
          const newFoots = this.allFootMarks.find(
            (footMark) => footMark.stepName === stepName
          );
          this.footMarks = newFoots.footMark;
          this.openFootMark = this.footMarks.length - 1;
          this.footMarksLegth = this.footMarks.length;
          const lastFootmark = this.footMarks[this.footMarksLegth - 1];
          const findLogByName = this.logs.find(
            (log) => log.name === lastFootmark
          );
          if (!findLogByName) {
          }
          this.getLogs(processId, stepName, lastFootmark, 0, 10, 0);
          this.getPaginatedLogs(processId, stepName, lastFootmark, 0, 10, 0)
        }
      });
    }
  }

  logClose() {
    this.logOpen = false;
    this.fullmode = false;
  }

  loadInfo(stepName: string) {
    const info = this.pipelineStep.filter(function (data: any) {
      return data.name == stepName;
    });
  }

  private getGetProcessIds(commit: any): void {
    this.repo.getProcess(commit.data.sha).subscribe((res: any) => {
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
    this.openFootMark = footMarkIndex;
    this.newLogs = [];
    this.prevStepName = '';
    this.page = 0;
    this.limit = 0;
    this.prev_logs_size = 0;
    this.logs=[]
    const processId = this.pipeline.data.process_id;
    const findLogByName = this.logs.find((log) => log.name === foot);
    this.getPaginatedLogs(processId, nodeName, foot, 0, 10, 0)
    this.getLogs(processId, nodeName, foot, 0, 10, 0);
  }
}
