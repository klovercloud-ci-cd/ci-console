import {Component, Inject, OnInit} from '@angular/core';
import {dump as toYaml, load as fromYaml} from 'js-yaml';
import 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-scss';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {LighthouseGraphComponent} from "../lighthouse-graph/lighthouse-graph.component";

@Component({
  selector: 'kcci-lighthouse-info-modal',
  templateUrl: './lighthouse-info-modal.component.html',
  styleUrls: ['./lighthouse-info-modal.component.scss']
})
export class LighthouseInfoModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: LighthouseGraphComponent
  ) { }

  ngOnInit(): void {
    console.log("this.data",)
  }
  infoData= this.data
  title = 'angular-code-editor';
  //
  // json={
  //   "phone": "024-648-3804",
  //   "website": "ambrose.net",
  //   "company": {
  //     "name": "Hoeger LLC",
  //     "catchPhrase": "Centralized empowering task-force",
  //     "bs": "target end-to-end models"
  //   }
  // }
  some=toYaml(this.infoData);
}
