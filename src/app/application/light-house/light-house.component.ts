import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kcci-light-house',
  templateUrl: './light-house.component.html',
  styleUrls: ['./light-house.component.scss']
})
export class LightHouseComponent implements OnInit {

  constructor() { }

  agentArray: Array<any> = [
    {
      name: 'Agent-1',
      id:'agent_1',
      footmarks: [
        {
          name:'Service',
          id:'service_id',
          url:'default/klovercloud-service'
        },
        {
          name:'Deployment',
          id:'deployment_id',
          url:'default/klovercloud-deployment'
        }
      ]
    },
    {
      name: 'Agent-2',
      id:'agent_2',
      footmarks: [
        {
          name:'Service',
          id:'service_id',
          url:'default/klovercloud-service'
        },
        {
          name:'Deployment',
          id:'deployment_id',
          url:'default/klovercloud-deployment'
        },
        {
          name:'Configmap',
          id:'Configmap_id',
          url:'default/klovercloud-Configmap'
        }
      ]
    },
    {
      name: 'Agent-3',
      id:'agent_3',
      footmarks: [
        {
          name:'Configmap',
          id:'Configmap_id',
          url:'default/klovercloud-Configmap'
        }
      ]
    },
    // {
    //   name: 'Agent-4',
    //   id:'agent_4',
    //   footmarks: [
    //     {
    //       name:'Configmap',
    //       id:'Configmap_id',
    //       url:'default/klovercloud-Configmap'
    //     }
    //   ]
    // },
    // {
    //   name: 'Agent-5',
    //   id:'agent_5',
    //   footmarks: [
    //     {
    //       name:'Configmap',
    //       id:'Configmap_id',
    //       url:'default/klovercloud-Configmap'
    //     }
    //   ]
    // },
  ]

  public getOffset(el: any) {
    const rect: any = el.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    };
  }
  ngOnInit(): void {
    setTimeout(() => {
      const svg: any = document.getElementById('root_process');
      const svgOfset = this.getOffset(svg);
      console.log("Root:",svgOfset);
    })
    this.rootLine();
  }

  rootLine() {
    // for (let item of this.agentArray) {
      this.agentArray.map((item,index)=>{

      setTimeout(() => {
        const svg: any = document.getElementById('svg');
        const svgOfset = this.getOffset(svg);
        const start = this.getOffset(document.getElementById('root_process'));
        const end = this.getOffset(document.getElementById(item.id));
        const line = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        );

        // 16*
        console.log("end,svgOfset::",start,svgOfset, start.y - svgOfset.y + 78);
        // 445
        line.setAttribute('x1', String(start.x - svgOfset.x + 80));
        line.setAttribute('y1', String(start.y - svgOfset.y + 38+(8*(this.agentArray.length))));
        line.setAttribute('x2', String(end.x - svgOfset.x + 2));
        line.setAttribute('y2', String(end.y - svgOfset.y + (16*(index+1)) + 10));
        line.setAttribute('stroke', 'white');
        line.setAttribute('stroke-width', '2px');
        line.setAttribute('id', 'agent_2_line');
        svg.appendChild(line)
      })

      })
  }

  getRoot(){
    setTimeout(() => {
      const svg: any = document.getElementById('root_process');
      const svgOfset = this.getOffset(svg);
      console.log("RootOfset:",svgOfset);
    })
  }

  getFootmarks(id:string,footmarks:any){
    setTimeout(() => {
      const svg: any = document.getElementById(id);
      const svgOfset = this.getOffset(svg);
      console.log("svgOfset:",svgOfset, "footmarks: ",footmarks);
    })
  }

}
