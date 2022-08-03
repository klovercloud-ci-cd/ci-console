import {Component, OnDestroy, OnInit} from '@angular/core';
import * as shape from 'd3-shape';
import {Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import {LighthouseService} from "../lighthouse.service";
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";
import {RepoServiceService} from "../../repository/repo-service.service";
import {ToolbarService} from "../../shared/services/toolbar.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LighthouseInfoModalComponent} from "../lighthouse-info-modal/lighthouse-info-modal.component";

@Component({
  selector: 'kcci-lighthouse-graph',
  templateUrl: './lighthouse-graph.component.html',
  styleUrls: ['./lighthouse-graph.component.scss']
})
export class LighthouseGraphComponent implements OnInit, OnDestroy {
  height:number=600;
  width:number=1000;
  subscription!: Subscription;
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
  tab: any;
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
  isTriggered:boolean=false;
  isPodChanged:number=1;
  triggeredNode:string='';
  nodes = [
    {
      id: 'root',
      label: 'Process',
    }
  ]
  links = []

  timeoutId: any;
  allPodsArray: any;

  legendArray:any=[
    {
      colorCode:'bg-[#50A649]',
      title:'Running'
    },
    {
      colorCode:'bg-[#22571D]',
      title:'Succeeded'
    },
    {
      colorCode:'bg-[#F1C40F]',
      title:'ContainerCreating'
    },
    {
      colorCode:'bg-[#9EE598]',
      title:'Available'
    },
    {
      colorCode:'bg-[#F28E8E]',
      title:'Unavailable'
    },
    {
      colorCode:'bg-[#DC7633]',
      title:'ErrImagePull'
    },
    {
      colorCode:'bg-[#EC7063]',
      title:'CreateContainerConfigError'
    },
    {
      colorCode:'bg-[#E74C3C]',
      title:'InvalidImageName'
    },
    {
      colorCode:'bg-[#CB4335]',
      title:'CreateContainerError'
    },
    {
      colorCode:'bg-[#B03A2E]',
      title:'ImagePullBackOff'
    },
    {
      colorCode:'bg-[#943126]',
      title:'CrashLoopBackOff'
    },
    {
      colorCode:'bg-[#B51601]',
      title:'Failed'
    },
    {
      colorCode:'bg-[#C0392B]',
      title:'OOMKilled'
    },
    {
      colorCode:'bg-[#A93226]',
      title:'Error'
    },
    {
      colorCode:'bg-[#922B21]',
      title:'ContainerCannotRun'
    },
    {
      colorCode:'bg-[#7B241C]',
      title:'DeadlineExceeded'
    },
    {
      colorCode:'bg-[#D35400]',
      title:'Unknown'
    }
  ]

  constructor(
    private route: ActivatedRoute,
    private navigateRoute: Router,
    private lighthouseService: LighthouseService,
    private snack: SharedSnackbarService,
    private repo: RepoServiceService,
    private _toolbarService: ToolbarService,
    private dialog: MatDialog,
  ) {
    this.route.queryParams.subscribe((res) => {
      this.root = res['root'];
      this.afterAgents = res['afterAgents'];
      this.pods = res['pods'];
      this.processID = res['processID'];
      this.title = res['title'];
      this.tab = res['tab'];
    });
    this._toolbarService.changeData({ title: this.title });
    this.getPipeline(this.processID);
  }

  public ngOnInit(): void {
  }

  public getStyles(): any {
    return {
      "background-color": '#fff'
    };
  }

  drawAgents(){
    this.fullAgentsArray?.map((step:any)=>{
      if(step.type== "DEPLOY"){
        this.agentsArray.push(step.params);
      }
    })

    let agentLinks: any, agentNodes: any;
    for(let i=0; i<this.agentsArray.length; i++){

      agentNodes = [
        {
          id: this.agentsArray[i].agent,
          name:this.agentsArray[i].agent,
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
    console.log("arr",this.nodes,this.links)
  }

  getPipeline(processId: any) {
    this.isTriggered=true
    this.isLoading = true;
    this.repo?.getPipeLine(processId)?.subscribe((res: any) => {
      if(res.data.steps){
        this.hasData=true;
      }
      this.isLoading = false;
      this.fullAgentsArray = res.data.steps;
    this.isTriggered=false
      this.drawAgents();
    },(err)=>{
      this.hasData=false;
      this.isLoading = false;
    this.isTriggered=false
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

  trigger(node_id:string,label:string, event: any, uid:string, agentType:string, triggerInitialization:number) {

    this.triggeredNode=node_id;
    if(this.checkAgents(node_id)){
      this.agentName=node_id;
    }

    if (event.target.getAttribute('id') == 'agentStep') {
    this.getKObjects(node_id,event,uid,label);
    }

    if (event.target.getAttribute('id') == 'k8s'){
      this.getPods(node_id,event,uid,agentType,triggerInitialization,label);
    }
    // console.log("eventCont",event.target.getAttribute('id'))
    if (this.containerAllArray && this.checkPods(event.target.getAttribute('id'))){
      // console.log("in")
      this.getContainer(node_id);
    }
  }

  // Drawing K8Objects

  getKObjects(node_id:string, event: any, uid:string,label:string){
    // console.log("[[[]]]onj",node_id)
    // this.width = this.width + 200;
    this.isTriggered=true
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
              this.isTriggered=false
              this.agents = node_id;
              this.afterAgentArray = res;


              for (let agent in this.afterAgentArray?.data) {

                this.afterAgentArray?.data[agent]?.map((item: any) => {

                  let available_replicas;
                  let unavailable_replicas;
                  if(item.number_available){
                    let total_replicas=item.number_available+item.number_unavailable;
                    available_replicas = (50 * item.number_available) / total_replicas;
                    unavailable_replicas = (50 * item.number_unavailable) / total_replicas;
                  }else {
                    available_replicas = (50 * item.ready_replicas) / item.replicas;
                    unavailable_replicas = (50 * (item.replicas - item.ready_replicas)) / item.replicas;
                  }
                  let rep_height = (50 - available_replicas).toString();

                  let enableTrigger:boolean=false;
                  if(!(agent=='deployments' || agent=='daemon_sets' || agent=='stateful_sets' || agent=='replica_sets')){
                    enableTrigger=true;
                  }

                  subNodes = [
                    {
                      id: item.name+item.uid,
                      name:item.name,
                      label: item.kind,
                      namespace: item.namespace,
                      replicas: item.replicas || null,
                      replica_height: available_replicas || '',
                      available_replicas: available_replicas || 0,
                      unavailable_replicas: unavailable_replicas || 0,
                      rep_height:rep_height,
                      type: "k8s",
                      podType:'',
                      containerData:'',
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
                      target: item.name+item.uid,
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

              this.height = this.height + (this.nodeArray.length*40);
            },
            (err) => {
              this.snack.openSnackBar('Agent not found!', err.error.message,'sb-warn');
              this.isTriggered=true
            });
      }
    }
  }

  // Drawing Pods

  getPods(node_id:string, event: any, uid:string,agentType:string,triggerInitialization:number,label:string){
    console.log("Subscription",(this.subscription)?"A":"B")

    // this.width = this.width + 200;
    if(triggerInitialization){
      this.isPodChanged=1
      this.isTriggered=true;
    }

    let pod_changed:number=1;

    this.typeName='';
    this.enableReload = true;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId =setTimeout(() => {
      (this.tab==='light-house') && this.lighthouseService.getPods(this.processID,this.agentName,this.typeName,uid)
        .subscribe(
          (res) => {
            if((res.data?.length!==this.allPodsArray?.length)){
              this.isPodChanged=1;
            }else {
              this.isPodChanged++;
            }
            if(!res){
              this.pods='';
            }
          })
      this.getPods(node_id,event,uid,agentType,0,label);
    }, 5000);

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
            this.subscription = this.lighthouseService.getPods(this.processID, this.agentName, this.typeName, uid)
            .subscribe(
              (res) => {
                if (res.data) {
                  console.log("response")
                this.isTriggered = false;
                this.allPodsArray = res.data;
                this.afterAgents = node_id;
                let some = res.data?.map((containerItem: any) => {
                  let name: any = [], status: any = [], podStatus = containerItem.status.phase,
                    namespace = containerItem.metadata.namespace;

                  for (let c_name in containerItem.spec.containers) {
                    name.push(containerItem.spec.containers[c_name]);
                  }
                  for (let c_status in containerItem.status.containerStatuses) {
                    status.push(containerItem.status.containerStatuses[c_status])
                  }
                  return {
                    'id': label + containerItem.metadata.name + containerItem.metadata.uid,
                    'name': name,
                    'status': status,
                    'podStatus': podStatus,
                    'namespace': namespace
                  }
                })
                this.containerAllArray = some;
                this.podArray = res;
                this.podArray?.data?.map((pod: any, index: number) => {
                  let podColor;
                  if (pod.status.phase === 'Succeeded') {
                    podColor = '#22571D'
                  }
                  else if (pod.status.phase === 'Failed') {
                    podColor = '#B51601'
                  }
                  else if (pod.status.phase === 'Unknown') {
                    podColor = '#D35400'
                  }
                  else{
                    let running: boolean = true;
                    for (let podItem in pod.status.containerStatuses) {
                      for (let containerState in pod.status.containerStatuses[podItem].state) {
                        if (containerState == 'terminated') {
                          if(pod.status.containerStatuses[podItem].state[containerState].reason === 'OOMKilled') {
                            podColor = '#C0392B';
                            running = false;
                            break;
                          }
                          else if(pod.status.containerStatuses[podItem].state[containerState].reason === 'Error') {
                            podColor = '#A93226';
                            running = false;
                            break;
                          }
                          else if(pod.status.containerStatuses[podItem].state[containerState].reason === 'ContainerCannotRun') {
                            podColor = '#922B21';
                            running = false;
                            break;
                          }
                          else if(pod.status.containerStatuses[podItem].state[containerState].reason === 'DeadlineExceeded') {
                            podColor = '#7B241C';
                            running = false;
                            break;
                          }
                          else if(pod.status.containerStatuses[podItem].state[containerState].reason !== 'Completed' && pod.status.containerStatuses[podItem].state[containerState].reason !== 'Running') {
                            podColor = '#B51601';
                            running = false;
                            break;
                          }
                          else {
                            podColor = '#B51601';
                            running = false;
                          }
                        } else if (containerState == 'waiting') {
                          running = false;
                          if (pod.status.containerStatuses[podItem].state[containerState].reason == 'ImagePullBackOff') {
                            podColor = '#B03A2E'
                            break;
                          } else if (pod.status.containerStatuses[podItem].state[containerState].reason == 'CrashLoopBackOff') {
                            podColor = '#943126';
                            break;
                          } else {
                            podColor = '#F84141';
                          }
                        }
                      }
                    }
                    if (running) {
                      podColor = '#50A649'
                    }
                  }
                  subNodes = [
                    {
                      id: label + pod.metadata.name + pod.metadata.uid,
                      label: pod?.metadata.kind || 'POD',
                      name: pod.metadata.name,
                      type: label + pod.metadata.name + pod.metadata.uid,
                      pod: 'pod',
                      uid: pod.metadata.uid || '',
                      containerData: pod,
                      agentType: pod.kind.toLowerCase() || '',
                      namespace: pod.metadata.namespace,
                      options: {
                        color: podColor,
                      }
                    }
                  ]
                  subLinks = [
                    {
                      source: node_id,
                      target: label + pod.metadata.name + pod.metadata.uid,
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
              }else {
                  console.log("no data")
                  this.afterAgents = '';
                  this.isTriggered = false;
                  this.snack.openSnackBar('No Pods found!', '','sb-warn');
                }
              })
          }
        }
      }

    this.isPodChanged++;
  }

  getContainer(node_id:string){

    // this.width = this.width + 200;
    this.containerArrow = false;
    this.pods = node_id;

    let subLinks: any, subNodes: any, podNodes: any, podLinks: any;
    // console.log("in")
    for (let i = 0; i < this.podLinkArray.length; i++) {

      // console.log("in")
      // @ts-ignore
      if ((node_id == this.podLinkArray[i]?.target)) {
        this.containerNodes = this.podNodeArray;
        this.containerLinks = this.podLinkArray;

        for (let i=0; i<this.containerAllArray.length; i++){
          let containerClr='';

          if (this.containerAllArray[i].podStatus==='Succeeded'){
            containerClr='#22571D'
          }
          if (this.containerAllArray[i].podStatus==='Failed'){
            containerClr='#B51601'
          }
          // console.log("in",'----',this.containerAllArray[i].id,"----",node_id)
          if(this.containerAllArray[i].id===node_id) {

            // console.log("in",'----',this.containerAllArray[i].id,"----",node_id)
            for (let container in this.containerAllArray[i].name) {
              // console.log("COntainer:",this.containerAllArray[i].name)
              for (let containerInfo in this.containerAllArray[i].name[container]){
              }
              let c_Color="";

              for (let containerColor in this.containerAllArray[i].status){

              }
              for(let stateColor in this.containerAllArray[i].status[container].state){

                if(stateColor==='running'){
                  c_Color='#50A649'
                }
                if(stateColor==='waiting'){
                  c_Color='#e3c918'
                }
                if(stateColor==='terminated'){
                  c_Color='#f60d0d'
                }
              }
              let reason:string='';
              if(this.containerAllArray[i].status[container].state.hasOwnProperty('running')){
                reason='running';
              }else if(this.containerAllArray[i].status[container].state.hasOwnProperty('waiting')){
                reason=this.containerAllArray[i].status[container].state.waiting.reason;
                if(this.containerAllArray[i].status[container].state.waiting.reason==='ImagePullBackOff'){
                  c_Color = '#B03A2E'
                }else if(this.containerAllArray[i].status[container].state.waiting.reason==='CrashLoopBackOff'){
                  c_Color = '#943126'
                }else if(this.containerAllArray[i].status[container].state.waiting.reason==='ErrImagePull'){
                  c_Color = '#DC7633'
                }else if(this.containerAllArray[i].status[container].state.waiting.reason==='ImagePullBackOff'){
                  c_Color = '#B03A2E'
                }else if(this.containerAllArray[i].status[container].state.waiting.reason==='CreateContainerConfigError'){
                  c_Color = '#EC7063'
                }else if(this.containerAllArray[i].status[container].state.waiting.reason==='InvalidImageName'){
                  c_Color = '#E74C3C'
                }else if(this.containerAllArray[i].status[container].state.waiting.reason==='CreateContainerError'){
                  c_Color = '#CB4335'
                }else if(this.containerAllArray[i].status[container].state.waiting.reason==='ContainerCreating'){
                  c_Color = '#F1C40F'
                }else{
                  c_Color = '#b68c08'
                }
              }
              // console.log('COntainer',this.containerAllArray[i].name[container].name)
              subNodes = [
                {
                  id: this.containerAllArray[i].name[container].name,
                  name:this.containerAllArray[i].name[container].name,
                  label: 'CONTAINER',
                  type: this.containerAllArray[i].name[container].name,
                  colorType:'container',
                  namespace: this.containerAllArray[i].namespace,
                  reason:reason,
                  containerData:this.containerAllArray[i].name[container]||'',
                  options: {
                    color: c_Color || containerClr,
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

  detailsModal(id:string,uid:string,type:any,containerData:any){
    let objectType;
    if(containerData){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '100%';
      dialogConfig.maxWidth = '600px',
        dialogConfig.data = containerData
      this.dialog.open(LighthouseInfoModalComponent, dialogConfig);
    }else {
      if (type == 'pod') {
        objectType = 'pods'
      }
      objectType = type.replace(/_/g, "-");

      this.lighthouseService.getDetails(this.processID, this.agentName, objectType, uid)
        .subscribe(
          (res) => {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = false;
            dialogConfig.autoFocus = true;
            dialogConfig.width = '100%';
            dialogConfig.maxWidth = '600px',
              dialogConfig.data = res.data.obj
            this.dialog.open(LighthouseInfoModalComponent, dialogConfig);
          }, (err) => {

          })
    }

  }

  checkPods(id:string):boolean{
    console.log("contArray",this.containerAllArray)
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
  }

  ngOnDestroy() {
    // console.log("this.subscription",this.timeoutId)
    // clearTimeout(this.timeoutId);
    clearTimeout(this.timeoutId)
    this.subscription&& this.subscription.unsubscribe();
    // this.timeoutId && this.timeoutId.unsubscribe();
  }
}
