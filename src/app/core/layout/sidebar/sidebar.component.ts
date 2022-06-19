import { FlatTreeControl } from '@angular/cdk/tree';
import  { OnInit} from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import  { NavItem, NavItemNode } from './Sidenav';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @ViewChild('tree') tree: any;

  navItems: NavItem[] = [];

  // Cloud Provider
  cloudProviderOptions!: any[];

  selectedCloudProvider!: string;

  menuItem: any = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/',
    },
    {
      title: 'Repository',
      icon: 'inventory_2',
      route: '/repository',
    },
  ];

  constructor() {}

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

  ngOnInit(): void {
    this.navItems = [
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
}
