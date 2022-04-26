import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kcci-pipeline-log',
  templateUrl: './pipeline-log.component.html',
  styleUrls: ['./pipeline-log.component.scss'],
})
export class PipelineLogComponent implements OnInit {
  panelOpenState = false;
  showPipelineStepDestailsView: boolean = false;
  logStatus: any = [
    {
      title: 'Set up job',
      info: [
        'Secret source: Actions',
        'Prepare workfsdadceercfrrcvrvrbdv3333333333low directory',
        'Prepare all required actions',
        'Getting action download info',
      ],
    },
    {
      title: 'Run Action',
      info: [
        'Secret source: Acsdadceercfrrcvrvrbdv3333333333tions',
        'Prepare workflow directory',
        'Prepare all required actions',
        'Getting action download info',
      ],
    },
    {
      title: 'Set up Go',
      info: [
        'Secret source: Actions',
        'Prepare dworkflow directory',
        'Prepare all required actions',
        'Getting action dsdadceercfrrcvrvrbdv3333333333ownload info',
      ],
    },
    {
      title: 'Build',
      info: [
        'Secret source: Actions',
        'Prepare workflow directory',
        'Prepare all required actions',
        'Getting action download info',
      ],
    },
    {
      title: 'Test',
      info: [
        'Secret source: Actions',
        'Prepare workflow directory',
        'Prepare all required actions',
        'Getting action dodddddddddddddddddddddddddddwnload info',
      ],
    },
  ];
  constructor() {}

  ngOnInit(): void {}
  clickMe() {
    this.showPipelineStepDestailsView = !this.showPipelineStepDestailsView;
  }
}
