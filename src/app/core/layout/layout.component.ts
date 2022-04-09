import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  showFiller = true;
  pageTitle: string = '';
  data: any = {
    title: 'KloverCloud'
  };
  collapsed:boolean=false;

  constructor(private router: Router,
    private toolbarService: ToolbarService,) {}

  ngOnInit(): void {
    this.toolbarService.currentData.subscribe(currentData => this.data = currentData);
  }


  toggleCollapse(){
   this.collapsed = !this.collapsed;
  }

}
