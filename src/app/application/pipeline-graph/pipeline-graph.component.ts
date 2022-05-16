import {Component, Input, OnInit} from '@angular/core';
import data from "../ci-cd-pipeline/demo.json";
import {ApplicationListComponent} from "../application-list/application-list.component";
import {ToolbarService} from "../../shared/services/toolbar.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {UserDataService} from "../../shared/services/user-data.service";
import {AuthService} from "../../auth/auth.service";
import {AppListService} from "../app-list.service";
import {RepoServiceService} from "../../repository/repo-service.service";

@Component({
  selector: 'kcci-pipeline-graph',
  templateUrl: './pipeline-graph.component.html',
  styleUrls: ['./pipeline-graph.component.scss']
})
export class PipelineGraphComponent implements OnInit {

  pipelineStep = data.data.steps;
  completeNodeDraw: string[] = [];
  envList = this.allenv();
  stepsLists = this.stepsDetails()
  logToggle:boolean = false;
  logOpen: boolean = false;
  expanded = false;
  branchList:any;
  private id: any;
  fullmode = false;
  public commitList: any[]=[];
  content:any = ApplicationListComponent;
  constructor(
    private _toolbarService: ToolbarService,
    private http:HttpClient,
    private route:ActivatedRoute,
    private userInfo: UserDataService,
    private auth: AuthService,
    private applist: AppListService,
    private repo: RepoServiceService,
  ) {}
  @Input()  nodeName!: number | string;
  ngOnInit(): void {
    let pageTitle ='';
    const appId = this.route.snapshot.paramMap.get('appID')
    const repoId = this.route.snapshot.paramMap.get('repoID')
    const userId = this.auth.getUserData().user_id
    let companyId ='';
    let repo_type = '';
    this.userInfo.getUserInfo(userId).subscribe(res=>{
      companyId = res.data.metadata.company_id
      this.applist.getRepositoryInfo(companyId,this.route.snapshot.paramMap.get('repoID')).subscribe(res=>{

        repo_type = res.data.type;
        repo_type = repo_type+'s';
        let repoUrl = '';
        this.repo.getApplicationById(appId,repoId,companyId).subscribe(res=>{
          // @ts-ignore
          repoUrl = res.data.url
          // @ts-ignore
          pageTitle =res.data._metadata.name
          this._toolbarService.changeData({ title: pageTitle });
          // @ts-ignore
          this.repo.getBranch(repo_type,repoId,repoUrl).subscribe(res=>{
            // @ts-ignore
            this.branchList = res.data
            for(let branch of this.branchList){

              // @ts-ignore
              this.repo.getCommit(repo_type,repoId,repoUrl,branch.name).subscribe(res=>{

                this.commitList.push(
                  {
                    name:branch.name,
                    // @ts-ignore
                    commits:[...res.data]
                  }
                )
                // @ts-ignore
                //console.log(res.data)
              })
            }

          })
        })

      })
    })



  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const allFootSteps = document.getElementsByClassName('logExpansion');

      let lastChild =allFootSteps.length -1
      allFootSteps[lastChild].classList.replace('hidden','visible')

      console.log(this.branchList)
      const svgHeight =
        this.higestNodeEnv(this.nodeByEnv())[0].steps.length * 230;
      const svgWidth = this.totalenv() * 230;
      // @ts-ignore
      document.getElementById('svg').style.height = svgHeight + 'px';
      // @ts-ignore
      document.getElementById('svg').style.width = svgWidth + 'px';

      this.drawLines();
    }, 1);
  }

  expandLog(event:any,id:string) {
    const allFootSteps = document.getElementsByClassName('logExpansion');

    for (let footStep of allFootSteps){
      footStep.classList.replace('visible','hidden')
    }
    // @ts-ignore
    document.getElementById(id).classList.replace('hidden','visible')

  }
  fullMode(){
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
  private stepsDetails() {
    const envs = this.allenv();
    let nodList: string[] = [];
    let stepsDetails:any[] =[];
    let steps:any[]=[]
    for (let env of envs) {
      for (let step of this.pipelineStep) {
        if (step.params.env === env && !nodList.includes(step.name)) {
          nodList.push(step.name);
          steps.push({
            name: step.name,
            params: step.params,
            status: step.status
          })

        }
      }
      stepsDetails.push({
        envName:env,
        steps: steps
      })
      nodList = [];
      steps= [];
    }
    console.log(stepsDetails)
    return stepsDetails;
  }
  private higestNodeEnv(nodeObjByenv: object) {
    var longest = 0;
    var longestEnv: any = [];

    //console.log(longest)
    // @ts-ignore
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
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    };
  }

  private drawLines() {
    const svg = document.getElementById('svg');
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
          if (step.status ==='completed'){
            line.setAttribute('stroke', '#5BC4D6');
            line.setAttribute('marker-end', 'url(#trianglesuccess)');
          }
          else {
            line.setAttribute('stroke', 'gray');
            line.setAttribute('marker-end', 'url(#trianglegray)');
          }
          line.setAttribute('stroke-width', '5px');

          line.addEventListener('mouseenter', e => {
            line.setAttribute('stroke-width', '10px');
          })
          // @ts-ignore
          if (svg.appendChild(line)) {
            console.log(step.name + '-' + next);
          }
        }
      }
    }
  }


  startBuild(loaderid:any) {
    this.loadInfo(loaderid)
    const loader = document.getElementById(loaderid);
    // @ts-ignore
    loader.classList.add('active')
  }


  logClose(){
    this.logOpen =false
    this.fullmode = false;
  }
  loadInfo(stepName:string) {
    const info = data.data.steps.filter(
      function(data){ return data.name == stepName }
    );
    this.logOpen =!this.logOpen
  }


}
