import {OnInit, ViewChild} from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import  { SharedLayoutService } from '../shared-layout.service';
import {NavItem, NavItemNode} from "../sidebar/Sidenav";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";

@Component({
  selector: 'kcci-collapsed-sidebar',
  templateUrl: './collapsed-sidebar.component.html',
  styleUrls: ['./collapsed-sidebar.component.scss'],
})
export class CollapsedSidebarComponent implements OnInit {
  openCollapsedBar = false;
  @ViewChild('tree') tree: any;

  navItems: NavItem[] = [];
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
  ];

  constructor(private ss: SharedLayoutService) {}

  private _transformer = (node: NavItem, level: number) => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    url: node.url,
    icon: node.icon,
    level,
  })

  // nav
  treeControl = new FlatTreeControl<NavItemNode>(
    node => node.level, node => node.expandable);

  treeFlattener: any = new MatTreeFlattener (
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: NavItemNode) => node.expandable;

  ngOnInit(): void {    this.navItems = [
    {
      name: 'Settings',
      icon: 'settings',
      isExpanded: true,
      children: [
        { name: 'User', icon: 'people', url: '/users' },
        { name: 'Role', icon: 'manage_accounts', url: '/roles' },
      ],
    },
  ];
    this.dataSource.data = this.navItems;
  }

  openNav() {
    setTimeout(() => {
      this.ss.emitData();
    }, 400);
  }
}
