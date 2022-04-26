import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import data from './demo.json';
import { DrawDiagram } from './drawDiagram';
const draw = new DrawDiagram();
@Component({
  selector: 'kcci-ci-cd-pipeline',
  templateUrl: './ci-cd-pipeline.component.html',
  styleUrls: ['./ci-cd-pipeline.component.scss'],
})
export class CiCdPipelineComponent implements OnInit {
  //dataPipeLine =  data.pipeline.steps
  completeNodeDraw: string[] = [];

  constructor(private _toolbarService: ToolbarService) {}

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'pipelines' });
  }
}
