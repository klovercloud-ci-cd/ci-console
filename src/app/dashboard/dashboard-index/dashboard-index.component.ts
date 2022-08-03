import {
  AfterContentChecked,
  ChangeDetectorRef,
  ElementRef, OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { AuthService } from '../../auth/auth.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { SingleDataSet, MultiDataSet, Label,Color, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import {ResourcePermissionService} from "../../shared/services/resource-permission.service";
import {DashboardService} from "../dashboard.service";
import {MatTableDataSource} from "@angular/material/table";
import {UserDataService} from "../../shared/services/user-data.service";
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";
import {AddCompanyComponent} from "../../company/add-company/add-company.component";
import {Router, NavigationEnd,ActivatedRoute} from "@angular/router";
import { Observable,Subscription, interval  } from 'rxjs';

// import {Chart} from 'chartjs';

@Component({
  selector: 'kcci-dashboard-index',
  templateUrl: './dashboard-index.component.html',
  styleUrls: ['./dashboard-index.component.scss'],
})
export class DashboardIndexComponent implements OnInit, AfterContentChecked, OnDestroy {
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
  hasCompany: boolean =false;
  private closeSubject: any;
  user: any = this.authService.getUserData();
  test: any = 1;
  labelWiseColor= new Map<string, string>();
  currentUser: any;
  timeoutId: any;
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
    // private navigateRoute: Router,
    private router: Router, private activatedRoute: ActivatedRoute
    // private updateSubscription: Subscription

  ) {
    this._toolbarService.changeData({ title: 'Dashboard' });
    this.currentUser = this.authService.getUserData();
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
  podsStatusWiseColor:any=['#74aafa', '#a3e8b9','#f8c87e','#ff6e85', '#EC7063','#34495E','#BFC9CA','#CB4335']
  public agentsChartColors: Color[] = [{ backgroundColor: this.podsStatusWiseColor}];
  public usersChartColors: Color[] = [
    { backgroundColor: ['#A3E4D7', '#85929E'] },
  ];

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


  labelAndColor= new Map<string, string>();
  label:any= []
  color:any= []
  podCount:any= []
  agentWiseTotalPodCount:any=[]
  // agentsInfo: Agent[];

  refreshComponent(){
    this.router.navigate([this.router.url])
  }

  async ngOnInit(): Promise<void> {
    if (this.currentUser.metadata.company_id) {
      this.timeoutId = setTimeout(() => {
        this.router.url === '/' && location.reload()
      }, 10000);
    }
    if (!this.currentUser.metadata.company_id) {
      this.openDialog();
    }

    // this.isLoading=true;
    this.getDetails();
    // this.initLabelWiseColor()
    this._dashboardService.getAllAgents().subscribe((res)=>{
      this.agents=res.data;
      this.buildAgentsChartData=[]
      for(let item=0; item<res?.data?.length; item++){

        this._dashboardService.getPodsByAgent(res.data[item]["agent_name"]).subscribe((response)=>{

          this.hasData = true;
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
          this.hasData = false;
          // this.snack.openSnackBar('Error!',err.error.message,'sb-error')
        })}
      this.showPodsStatus=true
    },(err)=>{
      if (err.status==500){
        this.snack.openSnackBar('Error!', err.error.message, 'sb-error')
      }else{
        if (this.hasCompany) {
          this.snack.openSnackBar('Error!', err.error.message, 'sb-error')
        }
      }
    })
  }

  getDetails() {

    // <------------Webhook Section------------>

    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      if(res.data.metadata.company_id){
        this.hasCompany = true;
      }
      this._dashboardService.getAllWebhook(res.data.metadata.company_id).subscribe((res)=>{
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
        this.hasData = false;

      })
    })

    // <------------Pipeline Section------------>

    this._dashboardService.getAllProcesses().subscribe((res)=>{
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
      this.hasData = false;
      // this.snack.openSnackBar('Processes!',err.error.message,'sb-error')
    })

    // <------------Agents Section------------>


    let infoData;


    // <------------Users Section------------>


    this._dashboardService.getAllUsers().subscribe((res) => {
      this.hasUser = true;
      this.users = res;
      this.usersActive = this.users?.data?.users?.active;
      this.usersInactive = this.users?.data?.users?.inactive;
      this.totalUsers = this.usersActive + this.usersInactive;
      this.buildUsersChartData[0].data = [this.usersActive, this.usersInactive];
      },(err)=>{
        this.hasUser = false;
        // this.snack.openSnackBar('Users',err.error.message,'sb-error')
        }
      );
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '45vw';
    this.dialog.open(AddCompanyComponent, dialogConfig);
  }

  ngAfterContentChecked() {
    // this.cdref.detectChanges();
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutId)
  }
}
