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

// import {Chart} from 'chartjs';

@Component({
  selector: 'kcci-dashboard-index',
  templateUrl: './dashboard-index.component.html',
  styleUrls: ['./dashboard-index.component.scss'],
})
export class DashboardIndexComponent implements OnInit, AfterContentChecked {
  @ViewChild('textElement') textElement: ElementRef | any;
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
  private closeSubject: any;

  test: any = 1;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private _toolbarService: ToolbarService,
    private renderer: Renderer2,
    private cdref: ChangeDetectorRef,
    private resource: ResourcePermissionService
  ) {
    this._toolbarService.changeData({ title: 'Dashboard' });

    // console.log(this.resource.authorizedUser('Name','User'));

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
   pipelineChartLabels: Label[] = ['completed', 'failed','running', 'paused'];
   agentsChartLabels: Label[] = ['running', 'pending','unknown', 'succeeded','failed'];
   usersChartLabels: Label[] = ['active', 'inactive'];

   barChartType: ChartType = 'doughnut';
   barChartLegend = false;
   barChartPlugins: any = {};

     public webhookChartColors: Color[] = [
       { backgroundColor: ['#1ABC9C', '#BFC9CA'] },
     ];
    public pipelineChartColors: Color[] = [
      { backgroundColor: ['#7ade9a', '#ff3b5a','#428df9', '#BFC9CA'] },
    ];
    public agentsChartColors: Color[] = [
      { backgroundColor: ['#7ade9a', '#ff3b5a','#428df9', '#BFC9CA', '#ff3b5a'] },
    ];
    public usersChartColors: Color[] = [
      { backgroundColor: ['#1E8449', '#BFC9CA'] },
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
      data: [this.pipelineCompleted, this.pipelineFailed, this.pipelineRunning, this.pipelinePaused],
      fill: false,
      showLine: false,
      stack: '1'
    }
  ];

  buildAgentsChartData: ChartDataSets[] = [
    {
      backgroundColor: 'white',
      borderColor: 'transparent',
      data: [this.agentsPodsRunning, this.agentsPodsPending, this.agentsPodsUnknown, this.agentsPodsSucceeded, this.agentsPodsFailed],
      fill: false,
      showLine: false,
      stack: '1'
    }
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



  ngOnInit(): void {

    this.getDetails();

  }

  getDetails() {

      // <------------Webhook Section------------>

      this.webhook = {
        "data": {
          "application": {
            "webhook": {
              "enabled": 10,
              "disabled": 5,

            }
          },

        }
      }

      this.enabledWebhook = this.webhook.data.application.webhook.enabled;
      this.disabledWebhook = this.webhook.data.application.webhook.disabled;
      this.totalWebhook = this.enabledWebhook+this.disabledWebhook;
      this.buildWebhookChartData[0].data = [this.enabledWebhook, this.disabledWebhook];


      // <------------Pipeline Section------------>

        this.pipeline = {
            "data": {
              "pipeline": {
                "completed": 10,
                "failed": 5,
                "running": 2,
                "paused": 3
              }
            }
          }

        this.pipelineCompleted = this.pipeline.data.pipeline.completed;
        this.pipelineFailed = this.pipeline.data.pipeline.failed;
        this.pipelineRunning = this.pipeline.data.pipeline.running;
        this.pipelinePaused = this.pipeline.data.pipeline.paused;
    this.totalPipeline = this.pipeline.data.pipeline.completed + this.pipeline.data.pipeline.failed + this.pipeline.data.pipeline.running + this.pipeline.data.pipeline.paused;

        this.buildpipelineChartData[0].data = [this.pipelineCompleted, this.pipelineFailed, this.pipelineRunning, this.pipelinePaused];

      // <------------Agents Section------------>

      this.agents = {
        "data": {
          "agent": [
            {
              "name": "agent1",
              "pods": {
                "running": 10,
                "pending": 5,
                "unknown": 2,
                "succeeded": 3,
                "failed": 3
              },
              "deployment": {
                "count": 10
              }
            },
            {
              "name": "agent2",
              "pods": {
                "running": 15,
                "pending": 10,
                "unknown": 2,
                "succeeded": 3,
                "failed": 3
              },
              "deployment": {
                "count": 10
              }
            }
          ],

        }
      }
    let infoData;
      this.agents.data.agent.map((_items:any, index:any)=>{
        let totalPods;
        this.agentsPodsRunning = _items.pods.running;
        this.agentsPodsPending = _items.pods.pending;
        this.agentsPodsUnknown = _items.pods.unknown;
        this.agentsPodsSucceeded = _items.pods.succeeded;
        this.agentsPodsFailed = _items.pods.failed;
        this.totalPods = this.agentsPodsRunning + this.agentsPodsPending + this.agentsPodsUnknown + this.agentsPodsSucceeded + this.agentsPodsFailed;

        infoData = {
          "agentsPodsRunning": this.agentsPodsRunning,
          "agentsPodsPending": this.agentsPodsPending,
          "agentsPodsUnknown": this.agentsPodsUnknown,
          "agentsPodsSucceeded": this.agentsPodsSucceeded,
          "agentsPodsFailed": this.agentsPodsFailed,
          "totalPods": this.totalPods
        }

        // @ts-ignore
        // this.buildAgentsChartData.push(chartData);

        // @ts-ignore
        this.buildAgentsChartData.push([{
          backgroundColor: 'white',
          borderColor: 'transparent',
          data: [this.agentsPodsRunning, this.agentsPodsPending, this.agentsPodsUnknown, this.agentsPodsSucceeded, this.agentsPodsFailed],
          fill: false,
          showLine: false,
          stack: '1'
        }])
        this.podsInfo.push(infoData)
      })
    this.buildAgentsChartData.shift();

    // @ts-ignore
    // this.buildAgentsChartData;


    this.agentsArray = {"agentData":this.buildAgentsChartData, "data":this.podsInfo};


      // <------------Users Section------------>

          this.users = {
            "data": {
              "users": {
                "active": 10,
                "inactive":1
              }
            }
          }
          this.usersActive = this.users.data.users.active;
          this.usersInactive = this.users.data.users.inactive;
          this.totalUsers = this.usersActive + this.usersInactive;
          this.buildUsersChartData[0].data = [this.usersActive, this.usersInactive];

  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
