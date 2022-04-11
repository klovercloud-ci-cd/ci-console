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
  public getScreenHeight: any;

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    this.toolbarService.currentData.subscribe(
      (currentData) => (this.data = currentData)
    );
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    // console.log('Width----: ', this.getScreenWidth);
  }
  toggleCollapse() {
    // const bro = document.getElementById("mySidepanel").style.width = "0";
    this.collapsed = !this.collapsed;
  }

  // closeSidebar() {
  //   // this.openCollapsedBar = false;
  //   // @ts-ignore
  //   this.ss.toggleState$.subscribe((res) => (this.openCollapsedBar = res));
  //   console.log('Boom');
  //   this.ss.emitData();
  //   console.log('SS-U: ', this.openCollapsedBar);
  // }

  openNav() {
    this.openCollapsedBar = !this.openCollapsedBar;
    // @ts-ignore
    this.ss.toggleState$.subscribe((res) => (this.openCollapsedBar = res));
    this.ss.emitData();
  }
}
