import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedLayoutService } from '../shared-layout.service';

@Component({
  selector: 'kcci-collapsed-sidebar',
  templateUrl: './collapsed-sidebar.component.html',
  styleUrls: ['./collapsed-sidebar.component.scss'],
})
export class CollapsedSidebarComponent implements OnInit {
  openCollapsedBar: boolean = false;

  menuItem: any = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/',
    },
    {
      title: 'Applications',
      icon: 'apps',
      route: '/app/list',
    },
    {
      title: 'Pipeline',
      icon: 'analytics',
      route: '/app/pipe',
    },
    {
      title: 'Attach Company',
      icon: 'store',
      route: '/attach-company',
    },
  ];
  constructor(private ss: SharedLayoutService) {}

  ngOnInit(): void {}

  openNav() {
    setTimeout(() => {
      this.ss.emitData();
    }, 400);
  }
}
