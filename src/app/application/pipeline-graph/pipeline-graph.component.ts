import {Component, Input, OnInit} from '@angular/core';
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
  pipeline:any
  pipelineStep:any;
  completeNodeDraw: string[] = [];
  envList :any;
  stepsLists :any
  logToggle:boolean = false;
  logOpen: boolean = false;
  expanded = false;
  branchList:any;
  private commitLoad =false;
  fullmode = false;
  public branchs: any[]=[];
  public footMarks: any[]=[];
  public commitList: any[]=[];

   encodedUrlParams = this.route.snapshot.paramMap.get('appID')
   repoId = this.route.snapshot.paramMap.get('repoID')
   // @ts-ignore
    userInfo = this.auth.getUserData()
   companyId = this.userInfo.metadata.company_id;
   type = 'githubs'
   repoUrl = 'https://github.com/shabrul2451/test-app'

  content:any = ApplicationListComponent;
  public allFootMarks: any[]=[];
  public processIds: any[]=[];
  public footMarksLegth: number=0;
  constructor(
    private _toolbarService: ToolbarService,
    private http:HttpClient,
    private route:ActivatedRoute,
    private usersInfo: UserDataService,
    private auth: AuthService,
    private applist: AppListService,
    private repo: RepoServiceService,
  ) {}
  @Input()  nodeName!: number | string;
  ngOnInit(): void {
    let pageTitle ='';
    console.log(this.companyId, 'company id')
    console.log(this.repoId, 'repoId')
    console.log(this.type, 'type')
    console.log(this.repoUrl, 'repoUrl')
    console.log(atob(this.hexToBase64(this.encodedUrlParams)),'url params')
    this.repo.getBranch(this.type,this.repoId,this.repoUrl).subscribe(res=>{
      // @ts-ignore
      console.log(res.data)

      let i=0
      // @ts-ignore
      for (let name of res.data){

        this.branchs.push(name)
        if (i===0){
          this.repo.getCommit(this.type,this.repoId,this.repoUrl,name.name).subscribe(res=>{
            // @ts-ignore
            let i=0;
            // @ts-ignore

            for (let commit of res.data){
              if (i==0){
                //console.log(commit)
                // @ts-ignore
                console.log(commit.sha ,'commit0id o')
                // @ts-ignore
                this.repo.getProcess(commit.sha).subscribe(res=>{
                  // @ts-ignore
                  console.log(res.data[0].process_id,'process')
                  // @ts-ignore
                  for (let process of res.data){
                    this.processIds.push(process.process_id)
                  }
                  console.log(this.processIds,'id list')
                  // @ts-ignore
                  this.repo.getPipeLine(res.data[0].process_id).subscribe(res=>{
                    // @ts-ignore
                   this.pipelineStep=res.data.steps
                   this.pipeline=res;
                    this.envList = this.allenv();
                    this.stepsLists = this.stepsDetails()
                    console.log(this.stepsLists)

                  })
                })

              }
              i++
            }
          })
        }
        i++;
      }
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {

      console.log(this.branchList)
      const svgHeight =
        this.higestNodeEnv(this.nodeByEnv())[0].steps.length * 230;
      const svgWidth = this.totalenv() * 230;
      // @ts-ignore
      document.getElementById('svg').style.height = svgHeight + 'px';
      // @ts-ignore
      document.getElementById('svg').style.width = svgWidth + 'px';
      this.drawLines();

    }, 3000);
  }
  loadCommit(branchName:string){
    let index = true;
    for (let x of this.commitList){
      if (x.branch === branchName){
        index = false
      }
    }
    if (index) {
      this.repo.getCommit(this.type,this.repoId,this.repoUrl,branchName).subscribe(res=>{
        // @ts-ignore
        this.commitList.push(
          {
            branch:branchName,
        // @ts-ignore
            commits:[...res.data]
          }
        )
        console.log(this.commitList)
      })
    }
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
  protected hexToBase64(str:any) {
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
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
    setTimeout(()=>{
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
    },1000)
  }


  startBuild(stepName:any) {
    this.logOpen =!this.logOpen
    this.loadInfo(stepName)
    const processId = this.pipeline.data.process_id;
    console.log(processId,'process id from build')

    const loader = document.getElementById(stepName+'_loader');
    // @ts-ignore
    loader.classList.add('active')
    this.stepFootMark(processId,stepName)
    const allFootSteps = document.getElementsByClassName('logExpansion');
    let lastChild =allFootSteps.length -1;
    // @ts-ignore
    const hoal = Array.prototype.slice.call( allFootSteps )
  console.log(hoal, 'last child')

  }
  stepFootMark(processId:any,stepName:any)
  {
    const existFootMark = this.allFootMarks.find(o => o.stepName === stepName);
    if (existFootMark){
      this.footMarks = existFootMark.footMark;
      this.footMarksLegth = this.footMarks.length
    }
    else{
      this.repo.getfootPrint(processId,stepName).subscribe(res=>{
        // @ts-ignore
        //console.log(res.data.data)
        console.log(this.allFootMarks)
        this.allFootMarks.push( {
          // @ts-ignore
          stepName:stepName,
          // @ts-ignore
          footMark:[...res.data.data]
        })
       const newFoots = this.allFootMarks.find(o => o.stepName === stepName)
        this.footMarks = newFoots.footMark;
        this.footMarksLegth = this.footMarks.length

      })
    }

    console.log(this.footMarks, 'footmarks')
  }
  logClose(){
    this.logOpen =false
    this.fullmode = false;
  }
  loadInfo(stepName:string) {
    const info = this.pipelineStep.filter(
      // @ts-ignore
      function(data){ return data.name == stepName }
    );

  }


}
