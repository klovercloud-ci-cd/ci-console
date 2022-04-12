import { Component, OnInit } from '@angular/core';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';

@Component({
  selector: 'kcci-application-pipeline',
  templateUrl: './application-pipeline.component.html',
  styleUrls: ['./application-pipeline.component.scss'],
})
export class ApplicationPipelineComponent implements OnInit {
  constructor(private _toolbarService: ToolbarService) {}

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'pipelines' })
  }
}
