import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import data from './demo.json';
@Component({
  selector: 'kcci-ci-cd-pipeline',
  templateUrl: './ci-cd-pipeline.component.html',
  styleUrls: ['./ci-cd-pipeline.component.scss'],
})
export class CiCdPipelineComponent implements OnInit, AfterViewInit {
  datapipeline = data.pipeline.steps;

  constructor(private _toolbarService: ToolbarService) {}

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'pipelines' })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      function getOffset(el: any) {
        const rect = el.getBoundingClientRect();
        const div = document.getElementById('holder');
        // @ts-ignore
        const gg = div.getBoundingClientRect();
        return {
          x1y1: rect.x - gg.x,
          x2y2: rect.y - gg.y,
        };
      }
      const el = document.getElementById('build');
      const el2 = document.getElementById('interstep');
      const el3 = document.getElementById('deployDev');
      const el4 = document.getElementById('jenkinsjob');

      // Line Start = (x.offsetTop + {(mb-x)/2}) - x.offsetHeight
      // Line End = (x.offsetTop - {mb-x})

      console.log(
        el?.offsetTop,
        el?.offsetHeight,
        el2?.offsetTop,
        el2?.offsetHeight,
        el3?.offsetTop,
        el3?.offsetHeight,
        el4?.offsetTop,
        el4?.offsetHeight
      );

      console.log(getOffset(el));
      console.log(getOffset(el2));
      console.log(getOffset(el3));
    });
  }
}
