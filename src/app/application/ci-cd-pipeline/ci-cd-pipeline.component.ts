import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import data from './demo.json'
import {DrawDiagram} from './drawDiagram'
const draw = new DrawDiagram()
@Component({
  selector: 'kcci-ci-cd-pipeline',
  templateUrl: './ci-cd-pipeline.component.html',
  styleUrls: ['./ci-cd-pipeline.component.scss'],
})
export class CiCdPipelineComponent implements OnInit,AfterViewInit {
  pipelineStep =  data.steps;
  completeNodeDraw : string[]  = []
  envList = this.allenv()
  nodeByenv = this.nodeByEnv()
  constructor(private _toolbarService: ToolbarService) { }

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'pipelines' })
     }

  ngAfterViewInit(): void {
    setTimeout(()=>{

      const svgHeight =this.higestNodeEnv(this.nodeByEnv())[0].steps.length*214
      const svgWidth = this.totalenv()*214;
      // @ts-ignore
      document.getElementById('svg').style.height=svgHeight+'px'
      // @ts-ignore
      document.getElementById('svg').style.width=svgWidth+'px'

      this.drawLines()
    },1)



  }

  private totalenv() {
    return this.allenv().length;
  }
  private allenv() {
    const envlist: string | string[]=[]
    for (let step of this.pipelineStep){
      if (!envlist.includes(step.params.env)){
        envlist.push(step.params.env)
      }
    }
    return envlist;
  }
  private nodeByEnv(){
    const envs = this.allenv();
    let nodList: string[]= []
    const nodeObjByenv:any = []
    for (let env of envs){
      for (let step of this.pipelineStep){
        if (step.params.env === env && !nodList.includes(step.name)){
          nodList.push(step.name)
        }
      }
      nodeObjByenv.push({
        "name":env,
        "steps":nodList
      })
      nodList =[]
    }
    return nodeObjByenv;
  }
  private higestNodeEnv(nodeObjByenv:object){
    var longest = 0;
    var longestEnv:any = [];

    //console.log(longest)
    // @ts-ignore
    for (let env of nodeObjByenv) {
      if (env.steps.length > longest) {
        longestEnv = [env];
        longest = env.steps.length;
      } else if (env.steps.length == longest) {
        longestEnv.push(nodeObjByenv);
      }
    }
    return longestEnv;
  }
  public getOffset(el:any) {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY
    };
  }

  private drawLines() {
    const svg = document.getElementById('svg');
    const svgOfset = this.getOffset(svg)

    for (let step of this.pipelineStep){
      if (step.next !==null){
        const startNode =document.getElementById(step.name)
        const startNodeOfset  = this.getOffset(startNode)
        for (let next of step.next){
          const start = this.getOffset(document.getElementById(step.name))
          const end  = this.getOffset(document.getElementById(next))
          const line  = document.createElementNS('http://www.w3.org/2000/svg','line')
          line.setAttribute('x1',String(start.x - svgOfset.x+30));
          line.setAttribute('y1',String(start.y - svgOfset.y+30));
          line.setAttribute('x2',String(end.x - svgOfset.x+30));
          line.setAttribute('y2',String(end.y - svgOfset.y+30));
          line.setAttribute('id',step.name+'-'+next);
          line.setAttribute("stroke", "red")
          line.setAttribute("stroke-width", "4px")
          line.setAttribute("marker-end", "url(#triangle)");
          // @ts-ignore
          if (svg.appendChild(line)){
            console.log(step.name+'-'+next)
          }
        }
      }
    }
    /*for (let step of this.pipelineStep){

      // @ts-ignore
      for (let next of step.next){
        const start = this.getOffset(document.getElementById(step.name))
        const end  = this.getOffset(document.getElementById(next))
        const line  = document.createElementNS('http://www.w3.org/2000/svg','line')
        line.setAttribute('x1',String(start.x - svgOfset.x));
        line.setAttribute('y1',String(start.y - svgOfset.y));
        line.setAttribute('x2',String(end.x - svgOfset.x));
        line.setAttribute('y2',String(end.y - svgOfset.y));
        line.setAttribute('id',step.name+'-'+next);
        line.setAttribute("stroke", "white")
        // @ts-ignore
        if (svg.appendChild(line)){
          console.log(step.name+'-'+next)
        }
      }
    }*/
  }
}
