import { Component, OnInit,AfterViewInit } from '@angular/core';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { DrawDiagram } from '../ci-cd-pipeline/drawDiagram';
import data from '../ci-cd-pipeline/demo.json'
const draw = new DrawDiagram()

@Component({
  selector: 'kcci-application-pipeline',
  templateUrl: './application-pipeline.component.html',
  styleUrls: ['./application-pipeline.component.scss'],
})
export class ApplicationPipelineComponent implements OnInit,AfterViewInit {
  // constructor(private _toolbarService: ToolbarService) {}

  // ngOnInit(): void {
  //   this._toolbarService.changeData({ title: 'Test pipe' })
  // }

  dataPipeLine =  data.pipeline.steps
  completeNodeDraw : string[]  = []

  constructor(private _toolbarService: ToolbarService) { }

  drawNodeNew(){

    //main container
    const nodeContainer = document.getElementById('nodeContainer');

    for(let pipeLine of this.dataPipeLine) {
      if (pipeLine.next !== null) {
        // @ts-ignore
        if (!this.completeNodeDraw.find(element => element === pipeLine.name)){

            //single node div container
            const singleContainer = document.createElement('div')

          if (pipeLine.name ==='build'){
            singleContainer.setAttribute('class','flex justify-center')

          }
          else {
            singleContainer.setAttribute('class','flex justify-center my-24')
          }

            //creating single node div
            const singleNode = document.createElement('div')
            singleNode.setAttribute('class','h-10 w-10 bg-dark-primary rounded-full relative')

            //creating single node entry pointer
            if (pipeLine.name !=='build'){
              const singleNodeEntry = document.createElement('div')
              singleNodeEntry.setAttribute('class','absolute h-5 w-5 bg-gray-400 rounded-full top-1/3 -left-1/3')
              singleNodeEntry.setAttribute('id','entry_'+pipeLine.name)
              //appending entry pointer to the node
              singleNode.appendChild(singleNodeEntry)
            }
            //creating exit point
          const singleNodeExit = document.createElement('div')
          singleNodeExit.setAttribute('class','absolute h-5 w-5 bg-gray-400 rounded-full top-1/3 -right-1/3')
          singleNodeExit.setAttribute('id','exit_'+pipeLine.name)
          //appending entry pointer to the node
          singleNode.appendChild(singleNodeExit)

            //appending null node to null container
            singleContainer.appendChild(singleNode)

            //appending null to main container
            // @ts-ignore
            nodeContainer.appendChild(singleContainer)

            //keep track of done node
            this.completeNodeDraw.push(pipeLine.name)



            //creating multiple next node container
            const multiNextNode = document.createElement('div')
            multiNextNode.setAttribute("class", "flex justify-center mx-24")

            //creatinng flex container for multi node
            const flexBoxMultiNode = document.createElement('div')
            flexBoxMultiNode.setAttribute('class','flex flex-col gap-16')

            for(let nextPipeName of pipeLine.next){
              //creting multi nodes
              const multiNode = document.createElement('div')
              multiNode.setAttribute("class", "h-10 w-10 bg-dark-primary rounded-full relative")

              //creating exit point
              const multiNodeExit = document.createElement('div')
              multiNodeExit.setAttribute('class','absolute h-5 w-5 bg-gray-400 rounded-full top-1/4 -right-1/4')
              multiNodeExit.setAttribute('marker-end','url(#triangle)')
              multiNodeExit.setAttribute('id','exit_'+nextPipeName)

              //appending entry pointer to the node
              multiNode.appendChild(multiNodeExit)

              //creating exit point
              const multiNodeEnty = document.createElement('div')
              multiNodeEnty.setAttribute('class','absolute h-5 w-5 bg-gray-400 rounded-full top-1/4 -left-1/4')
              multiNodeEnty.setAttribute('id','entry_'+nextPipeName)

              //appending entry pointer to the node
              multiNode.appendChild(multiNodeEnty)

              //appending multi nodes to flex box
              flexBoxMultiNode.appendChild(multiNode)

              //keep track of done node
              this.completeNodeDraw.push(nextPipeName)
            }

            //flex box appending
            multiNextNode.appendChild(flexBoxMultiNode)

            //appending multiple to main container
            // @ts-ignore
            nodeContainer.appendChild(multiNextNode)

        }
      }
      else {
        if (!this.completeNodeDraw.find(element => element === pipeLine.name)){
          //create null div container
          const nullContainer = document.createElement('div')
          nullContainer.setAttribute('class','flex justify-center')

          //creating null node div
          const nullNode = document.createElement('div')
          nullNode.setAttribute('class','h-10 w-10 bg-dark-primary rounded-full relative')

          //creating null node entry pointer
          const nullNodeEntry = document.createElement('div')
          nullNodeEntry.setAttribute('class','absolute h-5 w-5 bg-gray-400 rounded-full top-1/3 -left-1/3')
          nullNodeEntry.setAttribute('id','entry_'+pipeLine.name)

          //appending entry pointer to the node
          nullNode.appendChild(nullNodeEntry)

          //appending null node to null container
          nullContainer.appendChild(nullNode)

          //appending null to main container
          // @ts-ignore
          nodeContainer.appendChild(nullContainer)

          //keep track of done node
          this.completeNodeDraw.push(pipeLine.name)

        }
      }
    }
  }


  drowLines(){
    const svg = document.getElementById('lines')
    for (let pipeline of this.dataPipeLine){
      const exitNode = document.getElementById('exit_'+pipeline.name)
      const exitNodeOffset = this.getOffset(exitNode)
      //console.log(exitNodeOffset)
      if (pipeline.next !==null){

        for (let next of pipeline.next) {
          const nextNodeEntry = document.getElementById('entry_'+next)
          const nextNodeOffsetEntry = this.getOffset(nextNodeEntry)

          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute('x1',String(exitNodeOffset.x))
          line.setAttribute('y1',String(exitNodeOffset.y+7))
          line.setAttribute('x2',String(nextNodeOffsetEntry.x-16))
          line.setAttribute('y2',String(nextNodeOffsetEntry.y+7))
          line.setAttribute("stroke-width",'5')
          line.setAttribute("stroke",'gray')
          // @ts-ignore
          svg.appendChild(line);
          //console.log(nextNodeOffsetEntry)
        }

      }
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
    this._toolbarService.changeData({ title: 'pipelines' })
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      //this.drawNodeNew()
      //this.drowLines()
      const array =[];
      const count: string[] =[]
      for(let x of this.dataPipeLine){
        if (!count.find(element => element === x.name)){
          array.push(x.name)
          count.push(x.name)
        }
        if (x.next){
          for (let n of x.next){
            if (!count.find(element => element === n)){
              array.push(' '+n)
              count.push(' ' +n)
            }
          }
        }
      }
      console.log(array)
      const arr = [
        'a',
        ' b',
        '  b',
        '  b',
        '    b',
        '     b',
        '  b',
        '  b',
        '   b',
        '    b',
        '     b',
        '      b',
      ]

      const tree = draw.textToTree(arr);
      const diagramSvg = document.getElementById("diagramSvg");
      const diagramGroup = document.getElementById("diagramGroup");

      // @ts-ignore
      draw.clear(diagramGroup);

      // @ts-ignore
      draw.treeToDiagram(tree, diagramSvg, diagramGroup);
    },100)
  }
}
