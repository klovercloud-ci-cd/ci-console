import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import data from './demo.json'
@Component({
  selector: 'kcci-ci-cd-pipeline',
  templateUrl: './ci-cd-pipeline.component.html',
  styleUrls: ['./ci-cd-pipeline.component.scss']
})
export class CiCdPipelineComponent implements OnInit,AfterViewInit {
  datapipeline =  data.pipeline.steps


  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      function getOffset(el: any) {
        const rect = el.getBoundingClientRect();
        const div= document.getElementById("holder")
        // @ts-ignore
        const gg = div.getBoundingClientRect()
        return {
          x1y1: (rect.x - gg.x),
          x2y2: (rect.y - gg.y)
        };
      }
      const el= document.getElementById("build")
      const el2= document.getElementById("interstep")
      const el3= document.getElementById("deployDev")
      console.log(getOffset(el))
      console.log(getOffset(el2))
      console.log(getOffset(el3))
    })

  }
}
