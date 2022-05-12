import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { RepoServiceService } from '../repo-service.service';

@Component({
  selector: 'kcci-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
})
export class RepositoryComponent implements OnInit, AfterViewInit {
  repooArray: any = [
    {
      name: 'KloverCloud-CICD',
      type: 'github',
      application: 10,
    },
    {
      name: 'Circle-CI',
      type: 'gitlab',
      application: 8,
    },
    {
      name: 'We Pro',
      type: 'bitbucket',
      application: 12,
    },
    {
      name: 'Get Commerce',
      type: 'github',
      application: 10,
    },
    {
      name: 'KloverCloud-Endless',
      type: 'gitlab',
      application: 6,
    },
    {
      name: 'KloverCloud-Console',
      type: 'bitbucket',
      application: 7,
    },
    {
      name: 'KloverCloud-Endless',
      type: 'gitlab',
      application: 6,
    },
    {
      name: 'KloverCloud-Console',
      type: 'bitbucket',
      application: 7,
    },
  ];
  repoArray: any = [];
  constructor(
    private repoService: RepoServiceService,
    private _toolbarService: ToolbarService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'Repositories' });
    console.log('Ree');
    this.repoService.getCompanyInfo().subscribe((response: any) => {
      console.log('Re:', response);
      this.repoArray = response.data.repositories;
    });
  }
  ngAfterViewInit(): void {}
}
