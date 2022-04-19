import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { AppListService } from '../app-list.service';
// import { DataService } from './data.service';

@Component({
  selector: 'kcci-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
})
export class ApplicationListComponent implements OnInit {
  isLoading: boolean = true;
  tableData: any = []
  displayedColumns = ['name', 'username', 'email', 'website'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(private service: AppListService,private _toolbarService: ToolbarService) {}

  ngOnInit() {
    this._toolbarService.changeData({ title: 'Applications' });
    this.service.getUserData().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.matSort;
      this.isLoading = false;
      //console.log("Data: ",this.tableData);
    });
  }

  filterData($event: any) {
    this.dataSource.filter = $event.target.value;
  }
}
