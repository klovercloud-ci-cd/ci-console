import {
  AfterContentChecked,
  ChangeDetectorRef,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { AuthService } from '../../auth/auth.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { SingleDataSet, MultiDataSet, Label,Color, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import {ResourcePermissionService} from "../../shared/services/resource-permission.service";
import {DashboardService} from "../dashboard.service";
import {MatTableDataSource} from "@angular/material/table";
import {UserDataService} from "../../shared/services/user-data.service";
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";

// import {Chart} from 'chartjs';

@Component({
  selector: 'kcci-dashboard-index',
  templateUrl: './dashboard-index.component.html',
  styleUrls: ['./dashboard-index.component.scss'],
})
export class DashboardIndexComponent implements OnInit, AfterContentChecked {
  @ViewChild('textElement') textElement: ElementRef | any;
  hasData:boolean=false;
  hasUser:boolean=false;
  hasWebhook:boolean=false;
  hasProcess:boolean=false;
  hasPods:boolean=false;
  totalWebhook:Number=0;
  totalPipeline:Number=0;
  totalPods:Number=0;
  totalUsers:Number=0;
  podsInfo:any=[];
  enabledWebhook = 0;
  disabledWebhook = 0;
  pipelineCompleted = 0;
  pipelineFailed = 0;
  pipelineRunning = 0;
  pipelinePaused = 0;
  pipelineNonInitialized = 0;
  agentsPodsRunning = 0;
  agentsPodsPending = 0;
  agentsPodsUnknown = 0;
  agentsPodsSucceeded = 0;
  agentsPodsFailed = 0;
  usersActive = 0;
  usersInactive = 0;
  agentsArray:any;
  webhook:any;
  pipeline:any;
  agents:any;
  users:any;
  showPodsStatus: boolean =false
  private closeSubject: any;
  user: any = this.authService.getUserData();
  test: any = 1;
  labelWiseColor= new Map<string, string>();
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private _toolbarService: ToolbarService,
    private _dashboardService: DashboardService,
    private userInfo: UserDataService,
    private renderer: Renderer2,
    private cdref: ChangeDetectorRef,
    public resource: ResourcePermissionService,
    private snack: SharedSnackbarService,
  ) {
    this._toolbarService.changeData({ title: 'Dashboard' });

  }


  barChartOptions: ChartOptions = {
    // cutoutPercentage: 60,
    responsive: true,
    legend: { display: false },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }],
    }
  };

  webhookChartLabels: Label[] = ['enabled', 'disabled'];
  pipelineChartLabels: Label[] = ['completed', 'failed','running', 'paused', 'non_initialized'];

  agentsChartLabels: Label[][] = [];
  usersChartLabels: Label[] = ['active', 'inactive'];
  barChartType: ChartType = 'doughnut';
  barChartLegend = false;
  barChartPlugins: any = {};
  agentsChartLabelsArr: Label[][] = [['running', 'pending','unknown', 'succeeded','failed'],['running', 'pending','unknown', 'succeeded','failed']];
  LabelWisePodCounts: Number[][] =[]
  public webhookChartColors: Color[] = [
    { backgroundColor: ['#1ABC9C', '#BFC9CA'] },
  ];
  public pipelineChartColors: Color[] = [
    { backgroundColor: ['#a3e8b9', '#ff6e85','#74aafa', '#f8c87e', '#bbbcc7'] },
  ];
  // public agentsChartColors: Color[][] = [[{ backgroundColor: ['#7ade9a', '#ff3b5a','#428df9'] }],[{ backgroundColor: ['#7ade9a', '#ff3b5a'] }]];
  // Running","Succeeded","Pending","ImagePullBackOff","CrashLoopBackOff","Terminated","Unknown","Error"
  podsStatusWiseColor:any=['#74aafa', '#a3e8b9','#f8c87e','#ff6e85', '#EC7063','#34495E','#BFC9CA']
  public agentsChartColors: Color[] = [{ backgroundColor: this.podsStatusWiseColor}];
  // public agentsChartColor: Color[] = [];
  // public agentChartColors: Color[] = [ { backgroundColor: ['#428df9', '#7ade9a','#428df9',"#ff"] }];
  // public agentsChartColorsArr: Agent[]=[{ChartColors:[ { backgroundColor: ['#7ade9a', '#ff3b5a','#428df9'] }]}]
  public usersChartColors: Color[] = [
    { backgroundColor: ['#A3E4D7', '#85929E'] },
  ];

  // public barDummyChartColors: Color[] = [
  //   { backgroundColor: ['#C5CAE9', '#C5CAE9', '#C5CAE9'] },
  // ];

  buildWebhookChartData: ChartDataSets[] = [
    {
      backgroundColor: 'white',
      borderColor: 'transparent',
      data: [this.enabledWebhook, this.disabledWebhook],
      fill: false,
      showLine: false,
      stack: '1'
    }
  ];

  buildpipelineChartData: ChartDataSets[] = [
    {
      backgroundColor: 'white',
      borderColor: 'transparent',
      data: [this.pipelineCompleted, this.pipelineFailed, this.pipelineRunning, this.pipelinePaused, this.pipelineNonInitialized],
      fill: false,
      showLine: false,
      stack: '1'
    }
  ];

  buildAgentsChartData: ChartDataSets[] []= [
    // {
    //   backgroundColor: 'white',
    //   borderColor: 'transparent',
    //   data: [this.agentsPodsRunning, this.agentsPodsPending, this.agentsPodsUnknown, this.agentsPodsSucceeded, this.agentsPodsFailed],
    //   fill: false,
    //   showLine: false,
    //   stack: '1'
    // }
  ];

  buildUsersChartData: ChartDataSets[] = [
    {
      backgroundColor: 'white',
      borderColor: 'transparent',
      data: [this.usersActive, this.usersInactive],
      fill: false,
      showLine: false,
      stack: '1'
    }
  ];

// {
//   "deployment": {
//     "count": 0
//   },
//   "name": "def",
//   "pods": {
//     "ImagePullBackOff": 1,
//     "NullContainerStatuses1": 1,
//     "NullContainerStatuses2": 1,
//     "Succeeded": 1,
//     "WaitingReason3": 1
//   }
// }
  labelAndColor= new Map<string, string>();
  label:any= []
  color:any= []
  podCount:any= []
  agentWiseTotalPodCount:any=[]
  // agentsInfo: Agent[];

  async ngOnInit(): Promise<void> {

    // hasUser
    // hasWebhook
    // hasProcess
    // hasPods

    // this.isLoading=true;
    this.getDetails();
    // this.initLabelWiseColor()
    this._dashboardService.getAllAgents().subscribe((res)=>{
      console.log("getAllAgents: ",res, " len:",res.data.length)
      this.agents=res.data
      console.log("agents: ",this.agents)
      // this.agentsChartColors=[]
      this.buildAgentsChartData=[]
      for(let item=0; item<res.data.length; item++){

        this._dashboardService.getPodsByAgent(res.data[item]["agent_name"]).subscribe((response)=>{

          this.hasData = true;
          console.log("--------GetPodsByAgent response:",response);
          this.labelAndColor=new Map<string, string>();
          this.label=["Running","Succeeded","Pending","ImagePullBackOff","CrashLoopBackOff","Terminated","Unknown","Error"]
          this.podCount=[0,0,0,0,0,0,0]
          let totalPods: Number=0
          if (response.data["agent"]["pods"].Succeeded) {
            this.podCount[1] = response.data["agent"]["pods"]["Succeeded"]
            totalPods = totalPods + this.podCount[1]
          }
          if(response.data["agent"]["pods"]["Running"]){
            this.podCount[0]=response.data["agent"]["pods"]["Running"]
            totalPods = totalPods + this.podCount[0]
          }
          if(response.data["agent"]["pods"]["ImagePullBackOff"]){
            this.podCount[3]=response.data["agent"]["pods"]["ImagePullBackOff"]
            totalPods = totalPods + this.podCount[3]
            3
          }
          if(response.data["agent"]["pods"]["Pending"]){
            this.podCount[2]=response.data["agent"]["pods"]["Pending"]
            totalPods = totalPods + this.podCount[2]
          }
          if(response.data["agent"]["pods"]["CrashLoopBackOff"]){
            this.podCount[4]=response.data["agent"]["pods"]["CrashLoopBackOff"]
            totalPods = totalPods + this.podCount[4]
          }
          if(response.data["agent"]["pods"]["Unknown"]){
            this.podCount[7]=response.data["agent"]["pods"]["Unknown"]
            totalPods = totalPods + this.podCount[7]

          }
          if(response.data["agent"]["pods"]["Terminated"]){
            this.podCount[5]=response.data["agent"]["pods"]["Terminated"]
            totalPods = totalPods + this.podCount[5]
          }

          this.labelAndColor.forEach((value: string, key: string) => {
            this.label.push(key)
            this.color.push(value)
          });
          this.agentWiseTotalPodCount[item]=totalPods
          this.agentsChartLabels[item]=this.label
          this.LabelWisePodCounts[item]=this.podCount

          this.buildAgentsChartData[item]=[]

          this.buildAgentsChartData[item][0]= {
            backgroundColor: 'white',
            borderColor: 'transparent',
            data: this.podCount,
            fill: false,
            showLine: false,
            stack: '1'
          }

        },(err)=>{
          this.snack.openSnackBar('Error!',err.error.message,'sb-error')
        })}
      this.showPodsStatus=true
      console.log("agentsChartColors",this.agentsChartColors)
      console.log("agentsChartLabels",this.agentsChartLabels)
      console.log("LabelWisePodCounts",this.LabelWisePodCounts)
      console.log("agentData",this.buildAgentsChartData)
    },(err)=>{
      this.snack.openSnackBar('Error!',err.error.message,'sb-error')
    })

  }

  // initLabelWiseColor(){
  //   this.labelWiseColor.set("Succeeded","#7ade9a")
  //   this.labelWiseColor.set("Running","#ff3b5a")
  //   this.labelWiseColor.set("ImagePullBackOff","#D35400")
  //   this.labelWiseColor.set("Pending","#BFC9CA")
  //   this.labelWiseColor.set("CrashLoopBackOff","#F9E70E")
  //   this.labelWiseColor.set("Unknown","#f90ef5")
  //   this.labelWiseColor.set("Terminated","#f90e0e")
  // }
  getDetails() {

    // <------------Webhook Section------------>


    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      // console.log("User Info:",res.data.metadata.company_id)
      this._dashboardService.getAllWebhook(res.data.metadata.company_id).subscribe((res)=>{
        console.log("WebhookDashboard: ",res.data);
        if (res.data.application.webhook.disabled>0 || res.data.application.webhook.enabled>0){
          this.hasWebhook = true;
        }
        this.hasData = true;
        this.webhook = res;
        this.enabledWebhook = this.webhook.data.application.webhook.enabled;
        this.disabledWebhook = this.webhook.data.application.webhook.disabled;
        this.totalWebhook = this.enabledWebhook+this.disabledWebhook;
        this.buildWebhookChartData[0].data = [this.enabledWebhook, this.disabledWebhook];
      },(err)=>{
        this.snack.openSnackBar('Error!',err.error.message,'sb-error');
      })
    })




    // <------------Pipeline Section------------>

    this._dashboardService.getAllProcesses().subscribe((res)=>{
      console.log("Processes Response: ",res.data);
      if (res.data.pipeline.completed>0 || res.data.pipeline.failed>0 || res.data.pipeline.nonInitialized>0 || res.data.pipeline.paused>0 || res.data.pipeline.running>0){
        this.hasProcess = true;
      }

      this.hasData = true;
      this.pipeline = res;
      this.pipelineCompleted = this.pipeline.data.pipeline.completed;
      this.pipelineFailed = this.pipeline.data.pipeline.failed;
      this.pipelineRunning = this.pipeline.data.pipeline.running;
      this.pipelinePaused = this.pipeline.data.pipeline.paused;
      this.pipelineNonInitialized = this.pipeline.data.pipeline.nonInitialized;
      this.totalPipeline = this.pipeline.data.pipeline.completed + this.pipeline.data.pipeline.failed + this.pipeline.data.pipeline.running + this.pipeline.data.pipeline.paused + this.pipeline.data.pipeline.nonInitialized;

      this.buildpipelineChartData[0].data = [this.pipelineCompleted, this.pipelineFailed, this.pipelineRunning, this.pipelinePaused, this.pipelineNonInitialized];

    },(err)=>{
      this.snack.openSnackBar('Error!',err.error.message,'sb-error')
    })

    // <------------Agents Section------------>

    // this.agents = {
    //   "data": {
    //     "agent": [
    //       {
    //         "name": "agent1",
    //         "pods": {
    //           "running": 10,
    //           "pending": 5,
    //           "unknown": 2,
    //           "succeeded": 3,
    //           "failed": 3
    //         },
    //         "deployment": {
    //           "count": 10
    //         }
    //       },
    //       {
    //         "name": "agent2",
    //         "pods": {
    //           "running": 15,
    //           "pending": 10,
    //           "unknown": 2,
    //           "succeeded": 3,
    //           "failed": 3
    //         },
    //         "deployment": {
    //           "count": 10
    //         }
    //       },
    //       {
    //         "name": "agent3",
    //         "pods": {
    //           "running": 22,
    //           "pending": 11,
    //           "unknown": 33,
    //           "succeeded": 44,
    //           "failed": 55
    //         },
    //         "deployment": {
    //           "count": 10
    //         }
    //       }
    //     ],
    //
    //   }
    // }
    // console.log(this.agents)
    let infoData;
    // this.agents.data.agent.map((_items:any, index:any)=>{
    //   let totalPods;
    //   this.agentsPodsRunning = _items.pods.running;
    //   this.agentsPodsPending = _items.pods.pending;
    //   this.agentsPodsUnknown = _items.pods.unknown;
    //   this.agentsPodsSucceeded = _items.pods.succeeded;
    //   this.agentsPodsFailed = _items.pods.failed;
    //   this.totalPods = this.agentsPodsRunning + this.agentsPodsPending + this.agentsPodsUnknown + this.agentsPodsSucceeded + this.agentsPodsFailed;
    //
    //   infoData = {
    //     "agentsPodsRunning": this.agentsPodsRunning,
    //     "agentsPodsPending": this.agentsPodsPending,
    //     "agentsPodsUnknown": this.agentsPodsUnknown,
    //     "agentsPodsSucceeded": this.agentsPodsSucceeded,
    //     "agentsPodsFailed": this.agentsPodsFailed,
    //     "totalPods": this.totalPods
    //   }
    //
    //   // @ts-ignore
    //   // this.buildAgentsChartData.push(chartData);
    //
    //   // @ts-ignore
    //   this.buildAgentsChartData.push([{
    //     backgroundColor: 'white',
    //     borderColor: 'transparent',
    //     data: [this.agentsPodsRunning, this.agentsPodsPending, this.agentsPodsUnknown, this.agentsPodsSucceeded, this.agentsPodsFailed],
    //     fill: false,
    //     showLine: false,
    //     stack: '1'
    //   }])
    //   this.podsInfo.push(infoData)
    // })
    // this.buildAgentsChartData.shift();

    // @ts-ignore
    // this.buildAgentsChartData;





    // <------------Users Section------------>


    this._dashboardService.getAllUsers().subscribe((res) => {
      console.log("User Data: ",res);
      this.hasUser = true;
      this.users = res;
      this.usersActive = this.users?.data?.users?.active;
      this.usersInactive = this.users?.data?.users?.inactive;
      this.totalUsers = this.usersActive + this.usersInactive;
      this.buildUsersChartData[0].data = [this.usersActive, this.usersInactive];
      },(err)=>{
        console.log("errerr",err)
        }
      );


  }

  ngAfterContentChecked() {
    // this.cdref.detectChanges();
  }
}
