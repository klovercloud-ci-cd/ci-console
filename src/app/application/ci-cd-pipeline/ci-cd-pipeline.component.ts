import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { Component, Input } from '@angular/core';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { PipelineGraphComponent } from '../pipeline-graph/pipeline-graph.component';
import { PipelineOverviewComponent } from '../pipeline-overview/pipeline-overview.component';
import {LighthouseGraphComponent} from "../lighthouse-graph/lighthouse-graph.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'kcci-ci-cd-pipeline',
  templateUrl: './ci-cd-pipeline.component.html',
  styleUrls: ['./ci-cd-pipeline.component.scss'],
})
export class CiCdPipelineComponent
  implements OnInit, AfterViewInit, AfterContentChecked
{
  content: any;
  tabRoute: string = '';

  constructor(
    private _toolbarService: ToolbarService,
    private cdref: ChangeDetectorRef,
    private navigateRoute: Router,
    private route: ActivatedRoute,
  ) {

    this.route.queryParams.subscribe((res) => {
      if(!res['tab']){
      this.navigateRoute.navigate([], {
      queryParams: { tab: 'pipeline'},
      queryParamsHandling: 'merge',
    });
      }
      this.tabRoute = res['tab'];

      if(this.tabRoute=='pipeline'){
        // @ts-ignore
        document.getElementById('pipeline')?.classList.add('active');
      }
      if(this.tabRoute=='light-house'){
        // @ts-ignore
        document.getElementById('light-house')?.classList.add('active');
      }
    });
  }

  @Input() nodeName!: number | string;

  ngOnInit(): void {

    if(this.tabRoute=='pipeline'){
      // @ts-ignore
      document.getElementById('pipeline')?.classList.add('active');
    }
    if(this.tabRoute=='light-house'){
      // @ts-ignore
      document.getElementById('light-house')?.classList.add('active');
    }

    if(this.tabRoute == 'pipeline'){
      this.content = PipelineGraphComponent;
    }
    if(this.tabRoute == 'overview'){
      this.content = PipelineOverviewComponent;
    }
    if(this.tabRoute == 'light-house'){
      this.content = LighthouseGraphComponent;
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  goto(id: any) {

    if(this.tabRoute=='pipeline'){
      // @ts-ignore
      document.getElementById('pipeline')?.classList.add('active');
    }
    if(this.tabRoute=='light-house'){
      // @ts-ignore
      document.getElementById('light-house')?.classList.add('active');
    }

    // @ts-ignore

    if (id == 'pipeline') {
      this.navigateRoute.navigate([], {
        queryParams: { tab: 'pipeline'},
        queryParamsHandling: 'merge',
      });
      // @ts-ignore
      document.getElementById('pipeline').classList.add('active');
      // @ts-ignore
      document.getElementById('overview').classList.remove('active');
      // @ts-ignore
      document.getElementById('light-house').classList.remove('active');
      this.content = PipelineGraphComponent;
    }
    if (id == 'overview') {
      this.navigateRoute.navigate([], {
      queryParams: { tab: 'overview'},
      queryParamsHandling: 'merge',
    });

      // @ts-ignore
      document.getElementById('pipeline').classList.remove('active');
      // @ts-ignore
      document.getElementById('overview').classList.add('active');
      // @ts-ignore
      document.getElementById('light-house').classList.remove('active');
      this.content = PipelineOverviewComponent;
    }
    if (id == 'light-house') {
      this.navigateRoute.navigate([], {
      queryParams: { tab: 'light-house'},
      queryParamsHandling: 'merge',
    });

      // @ts-ignore
      document.getElementById('pipeline').classList.remove('active');
      // @ts-ignore
      document.getElementById('overview').classList.remove('active');
      // @ts-ignore
      document.getElementById('light-house').classList.add('active');
      this.content = LighthouseGraphComponent;
    }
  }

  ngAfterViewInit(): void {}
}
