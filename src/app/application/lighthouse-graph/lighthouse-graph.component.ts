import { Component, OnInit} from '@angular/core';
import * as shape from 'd3-shape';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import {LighthouseService} from "../lighthouse.service";
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";
import {RepoServiceService} from "../../repository/repo-service.service";
import {ToolbarService} from "../../shared/services/toolbar.service";

@Component({
  selector: 'kcci-lighthouse-graph',
  templateUrl: './lighthouse-graph.component.html',
  styleUrls: ['./lighthouse-graph.component.scss']
})
export class LighthouseGraphComponent implements OnInit {
  root:string='';
  agents?:string|null;
  afterAgents:string='';
  agentName:string='';
  pods:string='';
  typeName:string='';
  initial:number=0;
  pan:string = "horizontal"
  nodeIdArray:any=[];
  nodeArray:any=[]
  linkArray:any=[]
  afterAgentArray?:any;
  private processID: any;

  podArray: any ;

  hierarchialGraph = {nodes: [], links: []};

  // public curve: any = shape.curveBasis;
   // curve = shape.curveBundle.beta(1);
  curve: any = shape.curveLinear;
  // public curve: any = stepRound;

  update$: Subject<any> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();
  agentsArray:any=[];
  fullAgentsArray:any;
  podNodeArray: any;
  podLinkArray: any;
  title: any;
  aNodes:any=[];
  aLinks:any=[];
  podNodes:any=[];
  podLinks:any=[];
  containerNodes:any=[];
  containerLinks:any=[];
  containerAllArray: any;
  containerArrow:boolean=true;
  enableReload:boolean=false;
  hasData:boolean=false;
  isLoading:boolean=false;
  isPodChanged:number=1;
  nodes = [
    {
      id: 'root',
      label: 'Process',
    }
  ]
  links = []

  timeoutId: any
  allPodsArray: any;

  constructor(
    private route: ActivatedRoute,
    private navigateRoute: Router,
    private lighthouseService: LighthouseService,
    private snack: SharedSnackbarService,
    private repo: RepoServiceService,
    private _toolbarService: ToolbarService,
  ) {
    this.route.queryParams.subscribe((res) => {
      this.root = res['root'];
      this.afterAgents = res['afterAgents'];
      this.pods = res['pods'];
      this.processID = res['processID'];
      this.title = res['title'];
    });
    this._toolbarService.changeData({ title: this.title });
    this.getPipeline(this.processID);
  }

  public ngOnInit(): void {
    // this.kabir()
  }

  kabir(){
    setTimeout(()=>{
      this.kabir()
      // @ts-ignore
      console.log("some",event?.target?.getAttribute('class'))
    },1000)
  }

  public getStyles(): any {
    return {
      "background-color": '#fff'
    };
  }

  drawAgents(){
    this.fullAgentsArray.map((step:any)=>{
      if(step.type== "DEPLOY"){
        this.agentsArray.push(step.params);
      }
    })

    let agentLinks: any, agentNodes: any;
    for(let i=0; i<this.agentsArray.length; i++){

      console.log("step.params",this.agentsArray[i].agent)
      agentNodes = [
        {
          id: this.agentsArray[i].agent,
          label: this.agentsArray[i].agent,
          type: 'agentStep',
          replicas: null,
        }
      ]

      agentLinks = [
        {
          source: 'root',
          target: this.agentsArray[i].agent,
        },
      ]
      this.nodes = [...this.nodes, ...agentNodes];
      // @ts-ignore
      this.links = [...this.links, ...agentLinks];
    }
    // @ts-ignore
    this.hierarchialGraph.nodes = this.nodes;
    this.updateChart();
    // @ts-ignore
    this.hierarchialGraph.links = this.links;
    this.updateChart();
  }

  getPipeline(processId: any) {
    this.isLoading = true;
    this.repo?.getPipeLine(processId)?.subscribe((res: any) => {
      if(res.data.steps){
        console.log("Res:",res.data.steps)
        this.hasData=true;
      }
      this.isLoading = false;
      this.fullAgentsArray = res.data.steps;
      this.drawAgents();
    },(err)=>{
      this.hasData=false;
      this.isLoading = false;
    });
  }

  checkAgents(id:string):boolean{
   return this.agentsArray.some((item:any)=>{
      if(item.agent==id){
        return true;
      }else{
        return false;
      }
    })
  }

  trigger(node_id:string, event: any, uid:string, agentType:string) {

    if(this.checkAgents(node_id)){
      this.agentName=node_id;
    }

    if (event.target.getAttribute('id') == 'agentStep') {
    this.getKObjects(node_id,event,uid);
    }

    if (event.target.getAttribute('id') == 'k8s'){
      this.getPods(node_id,event,uid,agentType);
    }

    if (this.containerAllArray && this.checkPods(event.target.getAttribute('id'))){

      this.containerArrow = false;
      this.pods = node_id;
      console.log("this.pods",this.pods)

      let subLinks: any, subNodes: any, podNodes: any, podLinks: any;

      for (let i = 0; i < this.podLinkArray.length; i++) {
        // @ts-ignore
        if ((node_id == this.podLinkArray[i]?.target)) {

          this.containerNodes = this.podNodeArray;
          this.containerLinks = this.podLinkArray;


          for (let i=0; i<this.containerAllArray.length; i++){

            if(this.containerAllArray[i].id===node_id) {

              for (let container in this.containerAllArray[i].name) {

                let c_Color="";

                for (let containerColor in this.containerAllArray[i].status){

                }
                for(let stateColor in this.containerAllArray[i].status[container].state){

                  if(stateColor==='running'){
                    c_Color='#1482d2'
                  }
                  if(stateColor==='waiting'){
                    c_Color='#e3c918'
                  }
                  if(stateColor==='terminated'){
                    c_Color='#f60d0d'
                  }
                }
                console.log("this.containerAllArray[i].name[container].name---------",this.containerAllArray[i].name[container].name)
                  subNodes = [
                    {
                      id: this.containerAllArray[i].name[container].name,
                      label: this.containerAllArray[i].name[container].name,
                      type: "container",
                      colorType:'container',
                      namespace: 'kc',
                      options: {
                        color: c_Color,
                      }
                    }
                  ]

              subLinks = [
                {
                  source: node_id,
                  target: this.containerAllArray[i].name[container].name,
                },
              ]

              // @ts-ignore
              this.containerNodes = [...this.containerNodes, ...subNodes];

              // @ts-ignore
              this.containerLinks = [...this.containerLinks, ...subLinks];
            }
              //   })
            }
          }
          podNodes = this.containerNodes;
          podLinks = this.containerLinks;
          // @ts-ignore
          this.hierarchialGraph.nodes = podNodes;
          this.updateChart();
          // @ts-ignore
          this.hierarchialGraph.links = podLinks;
          this.updateChart();
        }
      }
    }

  }

  // Drawing K8Objects

  getKObjects(node_id:string, event: any, uid:string){
    this.enableReload = false;
    let subLinks: any, subNodes: any, agentNodes: any, agentLinks: any;

    for (let i = 0; i < this.links.length; i++) {
      // @ts-ignore
      if ((node_id == this.links[i]?.target)) {
        this.aNodes = this.nodes;
        this.aLinks = this.links;

        this.lighthouseService.getAfterAgents(this.processID,node_id)
          .subscribe(
            (res) => {
              console.log("Response:",res)
              this.agents = node_id;
              this.afterAgentArray = res;

              for (let agent in this.afterAgentArray?.data) {
                // daemon_sets,deployments,stateful_sets,replica_sets;

                this.afterAgentArray?.data[agent]?.map((item: any) => {
                  let replica_height = (50 * item.available_replicas) / item.replicas;
                  let rep_height = (50 - replica_height).toString();
                  console.log("agent",agent)
                  let enableTrigger:boolean=false;
                  if(!(agent=='deployments' || agent=='daemon_sets' || agent=='stateful_sets' || agent=='replica_sets')){
                    enableTrigger=true;
                  }
                  subNodes = [
                    {
                      id: item.name,
                      label: item.name,
                      namespace: item.namespace,
                      replicas: item.replicas || null,
                      replica_height: replica_height || '',
                      available_replicas: item.available_replicas || 0,
                      unavailable_replicas: item.unavailable_replicas || 0,
                      rep_height:rep_height,
                      type: "k8s",
                      podType:'',
                      uid:item.uid||'',
                      agentType:agent||'',
                      trigger:enableTrigger||false,
                      position: 'x0',
                      height: '50px',
                      width: '190px',
                      w: 190,
                      options: {
                        color: '#fff',
                      }
                    }
                  ]

                  subLinks = [
                    {
                      source: node_id,
                      target: item.name,
                    },
                  ]

                  // @ts-ignore
                  this.aNodes = [...this.aNodes, ...subNodes];

                  // @ts-ignore
                  this.aLinks = [...this.aLinks, ...subLinks];
                })
              }
              agentNodes = this.aNodes;
              agentLinks = this.aLinks;

              this.nodeArray = agentNodes;
              this.linkArray = agentLinks;
              // @ts-ignore
              this.hierarchialGraph.nodes = this.nodeArray;
              this.updateChart();
              // @ts-ignore
              this.hierarchialGraph.links = this.linkArray;
              this.updateChart();
            },
            (err) => {
              this.snack.openSnackBar('Localagents not found!', err.error.message,'sb-warn');
            });
      }
    }
  }

  // Drawing Pods

  getPods(node_id:string, event: any, uid:string,agentType:string){
    console.log("this.isPodChanged",this.isPodChanged)

    let pod_changed:number=1;

    //
    // if(pod_changed === 1){
    //   this.isPodChanged=1;
    // }else {
    //   this.isPodChanged=pod_changed;
    // }
    this.typeName='';
    // this.pods='';
    this.enableReload = true;
    // this.navigateRoute.navigate([], {
    //   queryParams: {
    //     '': null,
    //   },
    //   queryParamsHandling: 'merge'
    // })
    // this.pods='';

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {

      this.lighthouseService.getPods(this.processID,this.agentName,this.typeName,uid)
        .subscribe(
          (res) => {
            if((res.data.length!==this.allPodsArray.length)){
              this.isPodChanged=1;
            }else {
              this.isPodChanged++;
            }
            // this.isPodChanged=pod_changed;
            console.log('some')
          })

      this.getPods(node_id,event,uid,agentType);
    }, 5000);

    console.log("Reloaded!");

      let subLinks: any, subNodes: any, podNodes: any, podLinks: any;

      for (let i = 0; i < this.linkArray.length; i++) {
        // @ts-ignore
        if ((node_id == this.linkArray[i]?.target)) {

          this.podNodes = this.nodeArray;
          this.podLinks = this.linkArray;

          if (agentType === 'deployments') {
            this.typeName = 'deployments';
          } else if (agentType === 'daemon_sets') {
            this.typeName = 'daemonSets';
          } else if (agentType === 'replica_sets') {
            this.typeName = 'replicaSets';
          } else if (agentType === 'stateful_sets') {
            this.typeName = 'statefulSets';
          }

          if(this.isPodChanged===1){
          this.lighthouseService.getPods(this.processID, this.agentName, this.typeName, uid)
            .subscribe(
              (res) => {
                this.allPodsArray = res.data;
                this.afterAgents = node_id;
                let some = res.data.map((containerItem: any) => {

                  let name: any = [], status: any = [];

                  for (let c_name in containerItem.spec.containers) {
                    name.push(containerItem.spec.containers[c_name]);
                  }
                  for (let c_status in containerItem.status.containerStatuses) {
                    status.push(containerItem.status.containerStatuses[c_status])
                  }
                  return {'id': containerItem.metadata.name, 'name': name, 'status': status}
                })
                this.containerAllArray = some;
                this.podArray = res;
                this.podArray.data.map((pod: any) => {
                  console.log("Pods:", pod)
                  let podColor;
                  if (pod.status.phase === 'Succeeded') {
                    podColor = '#1d8d13'
                  }
                  if (pod.status.phase === 'Failed') {
                    podColor = '#f60d0d'
                  }
                  if (pod.status.phase === 'Unknown') {
                    podColor = '#d32dfa'
                  }
                  if (pod.status.phase === 'Running') {

                    for (let podItem in pod.status.containerStatuses) {

                      let running: boolean = true;
                      for (let containerState in pod.status.containerStatuses[podItem].state) {

                        if (containerState == 'terminated') {
                          podColor = '#B51601';
                          running = false;
                          break;
                        } else if (containerState == 'waiting') {
                          if (pod.status.containerStatuses[podItem].state[containerState].reason == 'ImagePullBackOff') {
                            podColor = '#E160C5'
                            break;
                          } else if (pod.status.containerStatuses[podItem].state[containerState].reason == 'CrashLoopBackOff') {
                            podColor = '#cc1567';
                            break;
                          } else {
                            podColor = '#F84141';
                          }
                          running = false;
                        }
                      }
                      if (running) {
                        podColor = '#1d8d13'
                      }
                    }
                  }

                  subNodes = [
                    {
                      id: pod.metadata.name,
                      label: pod.metadata.name,
                      type: pod.metadata.name,
                      pod: 'pod',
                      agentType: pod.metadata.name || '',
                      namespace: 'default',
                      options: {
                        color: podColor,
                      }
                    }
                  ]

                  subLinks = [
                    {
                      source: node_id,
                      target: pod.metadata.name,
                    },
                  ]

                  // @ts-ignore
                  this.podNodes = [...this.podNodes, ...subNodes];

                  // @ts-ignore
                  this.podLinks = [...this.podLinks, ...subLinks];
                })

                podNodes = this.podNodes;
                podLinks = this.podLinks;

                this.podNodeArray = podNodes;
                this.podLinkArray = podLinks;
                // @ts-ignore
                this.hierarchialGraph.nodes = this.podNodeArray;
                this.updateChart();
                // @ts-ignore
                this.hierarchialGraph.links = this.podLinkArray;
                this.updateChart();
              })
        }
        }
      }

    this.isPodChanged++;
  }

  detailsModal(id:string,event:any){
    console.log("Event:",this.processID,"--",this.agentName,"--",event,"--",this.typeName);
    // this.lighthouseService.getDetails(this.processID,this.agentName,event,this.typeName)
    //   .subscribe(
    //     (res) => {
    //
    //     },(err)=>{
    //
    //     })
    console.log("Modal ID:",id,event)
  }

  checkPods(id:string):boolean{
    return this.containerAllArray.some((item:any)=>{
      if(item.id==id){
        return true;
      }else{
        return false;
      }
    })
  }
  updateChart() {
    this.update$.next(true);
  }
  fitGraph() {
    this.zoomToFit$.next(true)
  }

  optionFunction() {
    console.log("Option dot clicked!")
  }

}
