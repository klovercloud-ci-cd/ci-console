import {AfterContentChecked, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ApplicationListComponent} from '../application-list/application-list.component';
import {ToolbarService} from '../../shared/services/toolbar.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {UserDataService} from '../../shared/services/user-data.service';
import {AuthService} from '../../auth/auth.service';
import {AppListService} from '../app-list.service';
import {RepoServiceService} from '../../repository/repo-service.service';

@Component({
  selector: 'kcci-pipeline-graph',
  templateUrl: './pipeline-graph.component.html',
  styleUrls: ['./pipeline-graph.component.scss'],
})
export class PipelineGraphComponent implements OnInit,AfterContentChecked {
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

  urlParams:any =JSON.parse(atob(this.hexToBase64(this.route.snapshot.paramMap.get('appID'))));
  repoId = this.route.snapshot.paramMap.get('repoID');
  userInfo = this.auth.getUserData();
  companyId = this.userInfo.metadata.company_id;
  type:any;
  repoUrl:any;

  content: any = ApplicationListComponent;
  public allFootMarks: any[] = [];
  public processIds: any[] = [];
  public footMarksLegth: number = 0;
  logs: any[] = [];
  nodeDetails: any = '';

  //refactor Start
  commit:any;
  _processIds:any

  constructor(
    private _toolbarService: ToolbarService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private usersInfo: UserDataService,
    private auth: AuthService,
    private applist: AppListService,
    private repo: RepoServiceService,
    private cdref: ChangeDetectorRef
  ) {
    this._toolbarService.changeData({title: this.urlParams.title})
  }

  @Input() nodeName!: number | string;

  ngOnInit() {
    this.type = this.urlParams.type.toLowerCase()+'s'
    this.repoUrl = this.urlParams.url
    this.repo
      .getBranch(this.type, this.repoId, this.repoUrl)
      .subscribe(  (res: any) => {
        this.branchs = res.data
        this.getCommit(this.branchs[0].name)
      });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  getCommit (branchName:any){
    this.repo
      .getCommit(this.type, this.repoId, this.repoUrl, branchName)
      .subscribe(  async (res: any) => {
        const commit = res.data;
        this.commitList.push({
          branch: branchName,

          commits: [...commit],
        });
        this.getProcess(commit[0].sha)
      });
  }
  getProcess(commitId:any){
    console.log(commitId)
    this.repo.getProcess(commitId).subscribe((res:any) => {
      this.processIds = res.data;
      console.log(this.processIds)
      this.getPipeline(this.processIds[0].process_id)
    });
  }
  getPipeline(processId:any){
    this.repo.getPipeLine(processId)
      .subscribe((res:any) => {
        this.pipelineStep = res.data.steps;
        this.pipeline = res;
        this.envList = this.allenv();
        this.stepsLists = this.stepsDetails();
        this.initSvgArrow();
        this.drawLines();
      });
  }
  initSvgArrow(){
    const svgHeight =
      this.higestNodeEnv(this.nodeByEnv())[0].steps.length * 230;
    const svgWidth = this.totalenv() * 230;

    // @ts-ignore
    document.getElementById('svg').style.height = svgHeight + 'px';
    // @ts-ignore
    document.getElementById('svg').style.width = svgWidth + 'px';

  }
  loadCommit(branchName: string) {
    const findLogByBranceName = this.commitList.find((list) => list.branch === branchName);
    if (!findLogByBranceName) {
      this.repo
        .getCommit(this.type, this.repoId, this.repoUrl, branchName)
        .subscribe((res: any) => {

          this.commitList.push({
            branch: branchName,

            commits: [...res.data],
          });
        });
    }
  }

  expandLog(event: any, footmarkName: string, nodeName: any) {
    const processId = this.pipeline.data.process_id;
    const allFootSteps = document.getElementsByClassName('logExpansion');

    const lastFootmark = this.footMarks[this.footMarksLegth - 1]

    const findLogByName = this.logs.find((log) => log.name === footmarkName);
    if (!findLogByName) {
      this.repo.getFootamarkLog(processId, nodeName, footmarkName).subscribe((res:any) => {
        for (let footStep of allFootSteps) {
          footStep.classList.replace('visible', 'hidden');
        }

        document.getElementById(footmarkName)?.classList.replace('hidden', 'visible');

        this.logs.push({
          name: footmarkName,

          data: res.data.data
        })

      })
    } else {
      for (let footStep of allFootSteps) {
        footStep.classList.replace('visible', 'hidden');
      }

      document.getElementById(footmarkName)?.classList.replace('hidden', 'visible');
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
    const rect:any = el.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    };
  }

  private drawLines() {
    setTimeout(() => {
      const svg:any = document.getElementById('svg');
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
              line.setAttribute('stroke', '#5BC4D6');
              line.setAttribute('marker-end', 'url(#trianglesuccess)');
            } else {
              line.setAttribute('stroke', 'gray');
              line.setAttribute('marker-end', 'url(#trianglegray)');
            }
            line.setAttribute('stroke-width', '5px');

            line.addEventListener('mouseenter', (e) => {
              line.setAttribute('stroke-width', '10px');
            });

            if (svg.appendChild(line)) {
            }
          }
        }
      }
    }, );
  }

  startBuild(stepName: any) {
    this.logOpen = !this.logOpen;
    this.loadInfo(stepName);
    const processId = this.pipeline.data.process_id;
    this.pipeline.data.steps.find((hola: any) => {
        if (hola.name === stepName) {
          this.nodeDetails = hola
        }
      }
    );
    const loader:any = document.getElementById(stepName + '_loader');

    loader.classList.add('active');
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
      this.repo.getfootPrint(processId, stepName).subscribe((res:any) => {

        this.allFootMarks.push({

          stepName: stepName,

          footMark: [...res.data.data],
        });
        const newFoots = this.allFootMarks.find((footMark) => footMark.stepName === stepName);
        this.footMarks = newFoots.footMark;
        this.footMarksLegth = this.footMarks.length;
        const lastFootmark = this.footMarks[this.footMarksLegth - 1]

        const findLogByName = this.logs.find((log) => log.name === lastFootmark);
        if (!findLogByName) {
          this.repo.getFootamarkLog(processId, stepName, lastFootmark).subscribe((res:any) => {


            this.logs.push({
              name: lastFootmark,

              data: res.data.data
            })
          })
        }
      });
    }

  }

  logClose() {
    this.logOpen = false;
    this.fullmode = false;
  }

  loadInfo(stepName: string) {
    const info = this.pipelineStep.filter(

      function (data:any) {
        return data.name == stepName;
      }
    );
  }

  private getGetProcessIds(commit:any):void {
    this.repo.getProcess(commit.data.sha).subscribe((res:any) => {
      this.processIds = res.data;
      this.repo.getPipeLine(res.data[0].process_id)
        .subscribe((res:any) => {

          this.pipelineStep = res.data.steps;
          this.pipeline = res;
          this.envList = this.allenv();
          this.stepsLists = this.stepsDetails();
          this.initSvgArrow();

        });
    });
  }
  getGetProcessById(commit:any,id:number):void {
    this.repo.getProcess(commit.data[0].sha).subscribe((res:any) => {
      this.processIds = res.data;
      this.repo.getPipeLine(res.data[0].process_id)
        .subscribe((res:any) => {

          this.pipelineStep = res.data.steps;
          this.pipeline = res;
          this.envList = this.allenv();
          this.stepsLists = this.stepsDetails();
          this.initSvgArrow();

        });
    });
  }
}
