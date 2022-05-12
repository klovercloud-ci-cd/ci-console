import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuItem: any = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/',
    },
    {
      title: 'Repository',
      icon: 'widgets',
      route: '/repository',
    },
    {
      title: 'Attach Company',
      icon: 'store',
      route: '/attach-company',
    },
  ];
  constructor() {}
  ngOnInit(): void {}
}
