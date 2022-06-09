import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
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
})
export class PipelineGraphComponent
  implements OnInit, AfterContentChecked, AfterContentInit
{
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
  nodeDetails: any = '';
  activeStep: any = '';

  //refactor Start
  commit: any;
  _processIds: any;
  isLoading = { graph: true, commit: true };
  socket: any;

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

    ];
    let i= 0
    this.footMarks.push('init_build_job1')
    setInterval(() => {
      let socketRes:any;
      if ((i === 0)) {
        socketRes = data[0]
      } else {
        socketRes= data[Math.floor(Math.random() * 10)+1];

        console.log(socketRes,Math.floor(Math.random() * 10))
      }
      this.footMarks.push(socketRes.footmark)
      i++

      ////------------------
      if (this.logOpen) {
        const scrollArea: any = document.getElementById(
          'scrollArea' + socketRes.footmark
        );
        if (!scrollArea.classList.contains('logPanel')) {
          scrollArea.classList.add('logPanel');
        }
      }


      setTimeout(()=>{
        this.expandLog(socketRes.footmark,socketRes.step)
      },300)

      if (
        (socketRes.status === 'INITIALIZING' &&
          this.activeStep != socketRes.step) ||
        (socketRes.status === 'PROCESSING' && this.activeStep != socketRes.step)
      ) {
        if (socketRes.status === 'INITIALIZING'){
          localStorage.setItem('isFailed', 'false');
          this.activeStep = socketRes.step;
          this.getPipelineWithStartBuild(socketRes.process_id);

        }
        if (socketRes.status === 'PROCESSING' && localStorage.getItem('isFailed') ==='false'){

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
    },3000);
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
  getLogs(processId:string,nodeName:string,footmarkName:string,page:number,limit:number,skip:number){
    this.repo
      .getFootamarkLog(processId, nodeName, footmarkName)
      .subscribe((res: any) => {
        console.log(res, 'footmarkslog');
        let isObjerving: boolean = false;
        const intObj: any = document.getElementById('intObj' + footmarkName);
        const observer = new IntersectionObserver(
          (entry: any) => {
            if (entry[0].isIntersecting) {
              isObjerving = true;
              console.log(entry[0].isIntersecting);
            } else {
              isObjerving = false;
              console.log(entry[0].isIntersecting);
            }
          },
          {
            root: document.getElementById('scrollArea' + footmarkName),
            rootMargin: '5px',
            threshold: 1.0,
          }
        );
        observer.observe(intObj);
        // @ts-ignore
        for (let footStep of allFootSteps) {
          footStep.classList.replace('visible', 'hidden');
        }

        document
          .getElementById(footmarkName)
          ?.classList.replace('hidden', 'visible');

        this.logs.push({
          name: footmarkName,

          data: res.data,
        });
      });
  }
  expandLog( footmarkName: string, nodeName: any) {
    const processId = this.pipeline.data.process_id;
    const allFootSteps = document.getElementsByClassName('logExpansion');

    const findLogByName = this.logs.find((log) => log.name === footmarkName);
    if (!findLogByName) {
      this.getLogs(processId, nodeName, footmarkName,0,10,0)
    } else {
      for (let footStep of allFootSteps) {
        footStep.classList.replace('visible', 'hidden');
      }

      document
        .getElementById(footmarkName)
        ?.classList.replace('hidden', 'visible');
    }
  }

  fullMode() {
    this.fullmode = !this.fullmode;
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
            line.setAttribute('stroke-width', '5px');

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
        if (res.data) {
          this.allFootMarks.push({
            stepName: stepName,

            footMark: [...res.data],
          });
          const newFoots = this.allFootMarks.find(
            (footMark) => footMark.stepName === stepName
          );
          this.footMarks = newFoots.footMark;
          this.footMarksLegth = this.footMarks.length;
          const lastFootmark = this.footMarks[this.footMarksLegth - 1];
          const findLogByName = this.logs.find(
            (log) => log.name === lastFootmark
          );
          if (!findLogByName) {
            this.repo
              .getFootamarkLog(processId, stepName, lastFootmark)
              .subscribe((res: any) => {
                this.logs.push({
                  name: lastFootmark,

                  data: res.data,
                });
              });
          }
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
}
