import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { SharedLayoutService } from './shared-layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  @HostListener('window:resize', ['$event'])

  isOpen: boolean = true;
  showFiller = true;
  pageTitle: string = '';
  public innerWidth: any;
  data: any = {
    title: 'KloverCloud',
  };
  collapsed: boolean = false;
  openCollapsedBar: boolean = false;

  constructor(
    private router: Router,
    private toolbarService: ToolbarService,
    private ss: SharedLayoutService
  ) {}

  public getScreenWidth: any;

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    if(this.getScreenWidth<1280){
      this.isOpen = false;
    }else{
      this.isOpen = true;
    } 
    this.toolbarService.currentData.subscribe(
      (currentData) => (this.data = currentData)
    );
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if(this.getScreenWidth<1280){
      this.isOpen = false;
    }else{
      this.isOpen = true;
    }
  }
  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.openCollapsedBar = !this.openCollapsedBar;
     // @ts-ignore
      this.ss.toggleState$.subscribe((res) => (this.openCollapsedBar = res));
      console.log('this.openCollapsedBar: ',this.openCollapsedBar);
      this.ss.emitData();
  }

  openNav(boom:any) {
    // this.openCollapsedBar = !this.openCollapsedBar;
    // @ts-ignore
    this.ss.toggleState$.subscribe((res) => (this.openCollapsedBar = res));
    this.ss.emitData();
    this.isOpen = boom;
  }
}

