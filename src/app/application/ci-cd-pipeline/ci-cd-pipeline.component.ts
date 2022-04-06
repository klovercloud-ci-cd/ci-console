import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import data from './demo.json'
@Component({
  selector: 'kcci-ci-cd-pipeline',
  templateUrl: './ci-cd-pipeline.component.html',
  styleUrls: ['./ci-cd-pipeline.component.scss']
})
export class CiCdPipelineComponent implements OnInit,AfterViewInit {
  datapipeline =  data.pipeline.steps
  completeNodeDraw : string[]  = []

  constructor() { }
  drawNode(){
    const nodeContainer = document.getElementById('nodeContainer');
    const singleNodeDiv = document.createElement('div')
    for(let x of this.datapipeline){
      if (x.next !== null){// null == end node//if not the end node
        if (x.next.length !== 1){// for multiple nex node
          if (this.completeNodeDraw.find(element => element === x.name)){
            //
          }else{
            const nullNode = document.createElement('div')
            nullNode.setAttribute("class", "w-14 h-14 bg-green-700 rounded-full")
            nullNode.setAttribute("id", x.name)
            // @ts-ignore
            nodeContainer.appendChild(nullNode)
            this.completeNodeDraw.push(x.name)

          }

          const multiNodeDiv = document.createElement('div')
          multiNodeDiv.setAttribute('class','flex gap-4')
          for(let nextPipeName of x.next){
            if (this.completeNodeDraw.find(element => element === nextPipeName)){
              //do something
            }
            else {
              const multiNode = document.createElement('div')
              multiNode.setAttribute("class", "w-14 h-14 bg-red-700 rounded-full")
              multiNode.setAttribute("id", nextPipeName)
              multiNodeDiv.appendChild(multiNode)
              this.completeNodeDraw.push(nextPipeName)
              //console.log(nextPipeName)
            }
          }
          // @ts-ignore
          nodeContainer.appendChild(multiNodeDiv)
        }
        // @ts-ignore
        nodeContainer.appendChild(singleNodeDiv)


      }
      else{// this is for end node
        if (this.completeNodeDraw.find(element => element === x.name)){
          //do something
        }
        else{
          const nullNode = document.createElement('div')
          nullNode.setAttribute("class", "w-14 h-14 bg-yellow-700 rounded-full")
          nullNode.setAttribute("id", x.name)
          // @ts-ignore
          nodeContainer.appendChild(nullNode)
          this.completeNodeDraw.push(x.name)
          //console.log(x.name)
        }
      }
    }
  }


  drowLines(){
    const svg = document.getElementById('lines')
    for (let pipeline of this.datapipeline){
      const mainNode = document.getElementById(pipeline.name)
      const mainNodeOffset = this.getOffset(mainNode)
      //console.log(pipeline.name)
      if (pipeline.next !==null){

          for (let next of pipeline.next){
            setTimeout(()=>{
              const nextNode = document.getElementById(next)
              const nextNodeOffset = this.getOffset(nextNode)
              const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
              line.setAttribute('x1',String(mainNodeOffset.x))
              line.setAttribute('y1',String(mainNodeOffset.y))
              line.setAttribute('x2',String(nextNodeOffset.x))
              line.setAttribute('y2',String(nextNodeOffset.y))
              line.setAttribute("stroke-width",'5')
              line.setAttribute("stroke",'red')
              // @ts-ignore
              svg.appendChild(line);
              //console.log('__'+next)
            })
          }
        }
        //console.log(pipeline.next)
      }



  }

  getOffset(el: any) {
    const rect = el.getBoundingClientRect();
    const div= document.getElementById("holder")
    // @ts-ignore
    const gg = div.getBoundingClientRect()
    return {
      x: (rect.x - gg.x),
      y: (rect.y - gg.y)
    };
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {


    setTimeout(()=>{
      this.drawNode()
      this.drowLines()
    })
  }
}
