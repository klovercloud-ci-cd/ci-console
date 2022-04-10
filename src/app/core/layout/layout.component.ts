import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';

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
    title: 'KloverCloud'
  };
  collapsed:boolean=false;


  constructor(private router: Router,
    private toolbarService: ToolbarService,) {
    }

  public getScreenWidth: any;
  public getScreenHeight: any;
  
  ngOnInit() {
      this.getScreenWidth = window.innerWidth;
      this.toolbarService.currentData.subscribe(currentData => this.data = currentData);
  }
  
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    console.log( "Width----: ",this.getScreenWidth);
    
  }
  toggleCollapse(){
   this.collapsed = !this.collapsed;
  }

  openNav(){
    alert("Hitted")
  }

}
