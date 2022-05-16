import {
  AfterViewInit,
  Component,
  ElementRef, Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import {PipelineGraphComponent} from "../pipeline-graph/pipeline-graph.component";
import {PipelineOverviewComponent} from "../pipeline-overview/pipeline-overview.component";
@Component({
  selector: 'kcci-ci-cd-pipeline',
  templateUrl: './ci-cd-pipeline.component.html',
  styleUrls: ['./ci-cd-pipeline.component.scss'],
})
export class CiCdPipelineComponent implements OnInit, AfterViewInit {
  content:any;
  constructor(
    private _toolbarService: ToolbarService
  ) {}
  @Input()  nodeName!: number | string;
  ngOnInit(): void {
    this.content = PipelineGraphComponent;
  }

  ngAfterViewInit(): void {

  }
  goto(id:any){
    // @ts-ignore
    document.getElementById('pipeline').classList.add('active')
    if (id == 'pipeline'){
      this.content = PipelineGraphComponent
    }
    if(id == 'overview'){
      this.content = PipelineOverviewComponent
    }
  }



}
