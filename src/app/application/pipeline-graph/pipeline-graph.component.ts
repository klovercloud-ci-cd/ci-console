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
import { SharedSnackbarService } from '../../shared/snackbar/shared-snackbar.service';

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
  next: any;
  prev: any;
  self: any;
  title: any;

  failed: any[] = [];
  error: any = {
    pipeline: '',
  };
  commitId: any;

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
  commitsPerCall: any;
  newLogs: any[] = [];
  branchName: any;
  pipeline: any;
  pipelineStep: any;
  envList: any;
  stepsLists: any;
  logOpen: boolean = false;
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
  prevStepName: string = '';
  page: number = 0;
  limit: any = 10;
  skip: number = 0;
  prev_logs_size: number = 0;
  nodeDetails: any = '';
  activeStep: any = '';
  init = false;
  commit: any;
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
    private navigateRoute: Router,
    private wsService: WsService,
    private tostr: ToastrService,
    private snackBar: SharedSnackbarService,
    private processLifecycleEventService: ProcessLifecycleEventService
  ) {
    this.route.queryParams.subscribe((res) => {
      this.title = res['title'];
    });
    this._toolbarService.changeData({ title: this.title });
  }

  ngAfterContentInit(): void {
    this.wsService.wsData.subscribe((res) => {
      this.socketres = res;
      const socketRes: any = res;
      if (socketRes.process_id == this.pipeline.data.process_id) {
        if (socketRes.status === 'INITIALIZING') {
          this.init = true;
          this.pipes
            .getStepDetails(socketRes.step, socketRes.process_id)
            .subscribe((res: any) => {
              if (
                res?.data.status === 'active' ||
                res?.data.status === 'non_initialized'
              ) {
                this.getPipeline(socketRes.process_id);
                this.openLogPanel(socketRes.step);
                setTimeout(() => {
                  this.setActiveFootMark(0);
                }, 1000);
              }
            });
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
            this.pipes
              .getStepDetails(socketRes.step, socketRes.process_id)
              .subscribe((res: any) => {
                if (res?.data.status === 'active') {
                  this.getPipeline(socketRes.process_id);
                  this.openLogPanel(socketRes.step);
                }
              });
          }
        }
        if (socketRes.status === 'FAILED' || socketRes.status === 'failed') {
          this.pipes
            .getStepDetails(socketRes.step, socketRes.process_id)
            .subscribe((res: any) => {
              if (res?.data.status === 'failed') {
                this.getPipeline(socketRes.process_id);
              }
            });
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
  }

  ngOnInit() {
    ///test
    this.route.queryParams.subscribe((res) => {
      this.title = res['title'];
      this.type = res['type'].toLowerCase() + 's';
      this.repoUrl = atob(res['url']);
      this.commitId = res['commitId'];
      if (res['page']) {
        this.currentPage = Number(res['page']);
      }
      if (res['limit']) {
        this.limit = res['limit'];
      }
    });

    this.pipes
      .getBranch(this.type, this.repoId, this.repoUrl)
      .subscribe((res: any) => {
        this.branchs = res.data;
        this.branchName = this.branchs[0].name;
        this.getCommit(this.branchs[0].name);
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
    this.repo
      .getCommit(this.type, this.repoId, this.repoUrl, branchName)
      .subscribe(async (res: any) => {
        this.commitsPerCall = res;
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
          queryParams: { page: this.currentPage, limit: this.limit },
          queryParamsHandling: 'merge',
        });
        if (this.commitId) {
          this.getProcess(this.commitId);
        } else {
          this.getProcess(this.commit[0].sha);
        }
      });
  }

  getPrevNextCommit(branchName: any, pageNumber: number) {
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
            queryParams: { page: pageNumber, limit: this.limit },
            queryParamsHandling: 'merge',
          });
        }
      });
  }

  getProcess(commitId: any) {
    this.isLoading.graph = true;
    this.repo.getProcess(commitId).subscribe((res: any) => {

      this.processIds = [];
      if (res.data == null) {

        this.error.pipeline = 'error';
        this.envList = '';
        this.pipeline = '';
        this.isLoading.graph = false;
      } else {
        if (res.data) {
          for (let branch in this.branchs) {
            for (let data of res?.data) {
              if (data.branch === this.branchs[branch].name) {
                this.setOpenBranch(parseInt(branch));
                this.loadCommit(data.branch);
              }
            }
          }
          this.error.pipeline = '';
          this.processIds = res.data;
          this.getPipeline(this.processIds[0].process_id);
        }
      }
    });
  }

  getPipeline(processId: any) {
    this.repo.getPipeLine(processId).subscribe((res: any) => {
      if (res.data == null) {
        this.tostr.warning(`No commit Found For this BRANCH`, 'Commits Empty', {
          enableHtml: true,
          positionClass: 'toast-top-center',
          tapToDismiss: false,
        });
      } else {
        this.isLoading.graph = false;
        setTimeout(() => {
          this.pipelineStep = res.data.steps;
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
    const svgHeight =
      this.higestNodeEnv(this.nodeByEnv())[0].steps.length * 300;
    const svgWidth = this.totalenv() * 300;

    // @ts-ignore
    document.getElementById('svg')?.style.height = svgHeight + 'px';
    // @ts-ignore
    document.getElementById('svg')?.style.width = svgWidth + 'px';
  }

  loadCommit(branchName: string) {
    this.currentPage = 0;
    this.navigateRoute.navigate([], {
      queryParams: { page: 0, limit: 5 },
      queryParamsHandling: 'merge',
    });

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

  getLogs(
    processId: string,
    nodeName: string,
    footmarkName: string,
    page: number,
    limit: number,
    skip: number,
    claim: number
  ) {
    const intObj: any = document.getElementById('intObj' + footmarkName);

    const observer = new IntersectionObserver(
      (entry: any) => {
        this.isObjerving = !!entry[0].isIntersecting;
      },
      {
        root: document.getElementById('scrollArea' + footmarkName),
        rootMargin: '10px',
        threshold: 1,
      }
    );
    observer.observe(intObj);

    this.repo
      .getFootamarkLog(processId, nodeName, footmarkName, page, limit, claim)
      .subscribe((res: any) => {
        if (res?.data !== null) {
          const footmarkData = [];
          for (let i = this.skip; i < res?.data.length; i++) {
            footmarkData.push(res?.data[i]);
          }

          if (res?.data.length < limit) {
            this.skip = res?.data.length;
          } else {
            this.skip = 0;
          }

          this.logs.push({
            name: footmarkName,
            data: [...footmarkData],
          });
        } else if (res?.data === null) {
          this.page -= 1;
        }

        if (this.skip == 0) {
          this.page++;
        }
        setTimeout(() => {
          if (this.isObjerving) {
            this.getLogs(
              processId,
              nodeName,
              footmarkName,
              this.page,
              this.limit,
              this.skip,
              claim
            );
          }
        }, 1500);
      });
  }

  fullMode(footMarkIndex: any, foot: any) {
    this.fullmode = true;
    // @ts-ignore
    document.getElementById('scrollArea' + foot).classList.add('logPanel');
    this.singleLogDetails = {
      index: footMarkIndex,
      footmark: foot,
    };
  }

  fullModeClose() {
    this.fullmode = false;
    // @ts-ignore
    document.getElementById('scrollArea' + foot).classList.remove('logPanel');
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
            type: step.type,
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
        if (step.status === 'active') {
          this.logOpen = true;
          const processId = this.pipeline.data.process_id;
          this.stepFootMark(processId, step.name);

          setTimeout(() => {
            this.pipeline.data.steps.find((hola: any) => {
              if (hola.name === step.name) {
                this.nodeDetails = hola;
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
    });
  }

  openLogPanel(stepName: any) {
    this.logOpen = true;

    const processId = this.pipeline.data.process_id;
    this.getPipeline(processId);
    this.stepFootMark(processId, stepName);

    setTimeout(() => {
      this.pipeline.data.steps.find((hola: any) => {
        if (hola.name === stepName) {
          this.nodeDetails = hola;
          this.openFootMarkName = this.footMarks[this.footMarks.length - 1];
          this.getLogs(
            processId,
            stepName,
            this.openFootMarkName,
            this.page,
            this.limit,
            this.skip,
            this.pipeline.data.claim
          );
        }
      });
    }, 300);
  }

  trigger(step: any) {
    const processId = this.pipeline.data.process_id;
    this.processLifecycleEventService
      .reclaim(processId, step.name, step.type)
      .subscribe((res: any) => {
        const processId = this.pipeline.data.process_id;
        this.getPipeline(processId);
      });
  }

  stepFootMark(processId: any, stepName: any) {
    this.repo
      .getfootPrint(processId, stepName)
      .subscribe((footMarkRes: any) => {
        this.stepStatus = footMarkRes.status;
        this.footMarks = footMarkRes.data;
        this.activeStep = stepName;
        this.setActiveFootMark(this.footMarks.length - 1);
        this.wsService.wsData.subscribe((WSRes) => {
          const socketRes: any = WSRes;
          if (socketRes.process_id == this.pipeline.data.process_id) {
            if (
              this.stepStatus !== 'active' &&
              this.openFootMark !== this.footMarks.indexOf(socketRes.footmark)
            ) {
              this.activeStep = socketRes.footmark;
              this.setActiveFootMark(
                this.footMarks.indexOf(socketRes.footmark)
              );
            }
            if (this.stepStatus === 'active') {
            }
          }
        });
        this.wsService.wsData.subscribe((res) => {
          // @ts-ignore
          if (res.step === this.openFootMarkName) {
            let found = 0;
            for (let x of this.footMarks) {
              // @ts-ignore
              if (x === res.footmark) {
                found = 1;
              }
            }
            if (found === 0) {
              // @ts-ignore
              this.footMarks.push(res.footmark);
            }
          }
        });
      });
  }

  logClose() {
    this.logOpen = false;
    this.fullmode = false;
    this.activeStep = '';
  }

  loadInfo(stepName: string) {
    this.pipelineStep.filter(function (data: any) {
      return data.name == stepName;
    });
  }

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
    if (status === 'active' && this.openFootMark === footMarkIndex) {
      // @ts-ignore
      document.getElementById('scrollArea' + foot).classList.add('logPanel');
    }
    this.page = 0;
    this.skip = 0;
    this.logs = [];
    const processId = this.pipeline.data.process_id;
    this.getLogs(
      processId,
      nodeName,
      foot,
      this.page,
      this.limit,
      this.skip,
      claim
    );
  }

  navigateToCommit(commit_Id: any) {
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
                const appId = res.data[0].process_id;
                this.navigateRoute
                  .navigateByUrl('/RefreshComponent', {
                    skipLocationChange: true,
                  })
                  .then(() => {
                    this.navigateRoute
                      .navigate(['repository', repoId, 'application'], {
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
              }
            }
          });
      } else {
        this.getProcess(commit_Id);
      }
    });
  }
}
